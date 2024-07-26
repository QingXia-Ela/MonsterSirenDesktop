use crate::{
    constants::SIREN_WEBSITE,
    global_struct::{
        music_injector::MusicInjector,
        siren::{
            response_msg::{ResponseMsg, SongsReponse},
            Album, BriefAlbum, BriefSong, Song,
        },
    },
    global_utils::decode_brotli,
    logger,
    plugin_error::PluginRequestError,
};
use indexmap::IndexMap;
use lazy_static::lazy_static;
use regex::Regex;
use reqwest::{
    header::{HeaderMap, *},
    Client,
};
use std::{borrow::BorrowMut, collections::HashMap, sync::Arc};
use warp::{
    filters::path::FullPath,
    reject::Rejection,
    reply::{Reply, Response},
};

type FilterType = Vec<[&'static str; 2]>;

lazy_static! {
  /// capture path like `/song/{{namespace}:}{id}`
  /// vanilla path doesn't have namespace like: `/song/{id}`
  static ref SONG_REGEX: Regex = Regex::new(r"/song/(?P<namespace>\w+):(?P<id>.+)").unwrap();
  /// capture path like `/album/{{namespace}:}{id}/detail` or `/song/{{namespace}:}{id}/data`
  /// two path will call method `get_album`
  static ref ALBUM_REGEX: Regex = Regex::new(r"/album/(?P<namespace>\w+):(?P<id>.+)/.+").unwrap();
}

fn parse_plugin_request_error_2_warp_rejection(err: PluginRequestError) -> warp::reply::Response {
    // warp::reject::
    err.into()
}

/// Get response from string
///
/// Add `Content-Length: {string len}`, `Content-Type: application/json` and `Access-Control-Allow-Origin: *`
fn get_response_from_string(s: String) -> Response {
    let len = s.len() as u64;
    let mut response = Response::new(s.into());
    let res_header_map = response.headers_mut();
    res_header_map.insert(CONTENT_LENGTH, len.into());
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    res_header_map.insert(CONTENT_TYPE, "application/json".parse().unwrap());

    response
}

/// Get all songs from injector, and return json string
async fn get_songs_from_injector_map(
    injector_map: Arc<IndexMap<String, MusicInjector>>,
) -> Response {
    let mut data: Vec<BriefSong> = vec![];
    for injector in injector_map.values() {
        // todo!: match lock
        for s in injector.request_interceptor.get_songs().await {
            data.push(s);
        }
    }
    let data = SongsReponse::new(data, None);
    // call unwrap because we ensure data is not empty
    let s = serde_json::to_string(&ResponseMsg::<SongsReponse<BriefSong>>::new(
        0,
        "".to_string(),
        data,
    ))
    .unwrap();
    get_response_from_string(s)
}

/// Get all albums from injector, and return json string
async fn get_albums_from_injector_map(
    injector_map: Arc<IndexMap<String, MusicInjector>>,
) -> Response {
    let mut data: Vec<BriefAlbum> = vec![];
    for injector in injector_map.values() {
        // todo!: match lock
        for s in injector.request_interceptor.get_albums().await {
            data.push(s);
        }
    }
    let s = serde_json::to_string(&ResponseMsg::<Vec<BriefAlbum>>::new(
        0,
        "".to_string(),
        data,
    ))
    .unwrap();
    get_response_from_string(s)
}

/// Handle api request and use plugin to modify response.
///
/// If no path match, request will be handled by vanilla api:
///
/// `https://monster-siren.hypergryph.com/api/{your_path}`
pub async fn handle_request_with_plugin(
    port: u16,
    cdn_port: u16,
    path: FullPath,
    headers: HeaderMap,
    filter_rules: FilterType,
    injector_map: Arc<IndexMap<String, MusicInjector>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let p = path.as_str();
    logger::info(format!("request path: {}", p).as_str());
    // song
    if let Some(caps) = SONG_REGEX.captures(p) {
        logger::debug("song request capture");

        let namesp = &caps["namespace"];
        let id = &caps["id"];
        if let Some(injector) = injector_map.get(namesp) {
            // todo!: match lock
            let res = injector.request_interceptor.get_song(id.to_string()).await;
            match res {
                Ok(r) => {
                    let res = ResponseMsg::<Song> {
                        code: 0,
                        msg: "".to_string(),
                        data: r,
                    };
                    return Ok(get_response_from_string(
                        serde_json::to_string(&res).unwrap(),
                    ));
                }
                Err(e) => {
                    return Ok(parse_plugin_request_error_2_warp_rejection(e.into()));
                }
            };
        }
    }
    // album
    else if let Some(caps) = ALBUM_REGEX.captures(p) {
        logger::debug("album request capture");

        let namesp = &caps["namespace"];
        let id = &caps["id"];
        if let Some(injector) = injector_map.get(namesp) {
            // todo!: match lock
            let res = injector.request_interceptor.get_album(id.to_string()).await;
            match res {
                Ok(r) => {
                    let res = ResponseMsg::<Album> {
                        code: 0,
                        msg: "".to_string(),
                        data: r,
                    };
                    return Ok(get_response_from_string(
                        serde_json::to_string(&res).unwrap(),
                    ));
                }
                Err(e) => {
                    return Ok(parse_plugin_request_error_2_warp_rejection(e.into()));
                }
            };
        }
    }
    // api without namespace
    match p {
        "/songs" => {
            logger::debug("match global api /songs, result will modify by plugins");
            Ok(get_songs_from_injector_map(injector_map)
                .await
                .into_response())
        }
        "/albums" => {
            logger::debug("match global api /albums, result will modify by plugins");
            Ok(get_albums_from_injector_map(injector_map)
                .await
                .into_response())
        }
        // todo!: add namespace specific api like "/songs/:namespace" and "/albums/:namespace", which can call target plugin utils
        _ => {
            logger::debug("no match, request will be handled by vanilla api");
            let res = handle_request(port, cdn_port, path, headers, filter_rules).await;
            match res {
                Ok(r) => Ok(r.into_response()),
                Err(e) => Err(e),
            }
        }
    }
}

// todo!: optimize it.
pub async fn handle_request(
    port: u16,
    cdn_port: u16,
    path: FullPath,
    _headers: HeaderMap,
    filter_rules: FilterType,
) -> Result<impl warp::Reply, warp::Rejection> {
    let client = Client::new();
    let target_url = String::from(format!(
        "https://monster-siren.hypergryph.com/api{}",
        path.as_str()
    ));

    let mut request_builder = client.get(&target_url);
    request_builder = request_builder.header("referer", SIREN_WEBSITE);

    let response_json = request_builder.send().await.unwrap();
    let mut response = Response::new("".into());

    let mut header_map = HeaderMap::new();
    for (k, v) in response_json.headers().iter() {
        header_map.insert(k.clone(), v.clone());
    }
    let mut res_str = String::new();

    match response.headers().get(CONTENT_ENCODING) {
        Some(v) => match v.to_str() {
            Ok("br") => {
                let decoded =
                    decode_brotli(&response_json.bytes().await.unwrap().to_vec().as_slice())
                        .unwrap();
                res_str = String::from_utf8(decoded).unwrap();
            }
            _ => res_str = response_json.text().await.unwrap(),
        },
        _ => res_str = response_json.text().await.unwrap(),
    };

    res_str = change_body(res_str, filter_rules, port, cdn_port);
    response = Response::new(res_str.clone().into());

    let res_header_map = response.headers_mut();
    for (k, v) in header_map.borrow_mut().into_iter() {
        res_header_map.insert(k.clone(), v.clone());
    }
    res_header_map.remove(CONTENT_ENCODING);

    // avoid content-length are not actual length
    res_header_map.insert(CONTENT_LENGTH, res_str.len().into());
    res_header_map.insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    // add cache
    res_header_map.insert(
        CACHE_CONTROL,
        format!("public, max-age={}", 15000).parse().unwrap(),
    );

    Ok(response)
}

fn change_body(body: String, filter_rules: FilterType, port: u16, cdn_port: u16) -> String {
    let mut basic = body
        // replace cdn
        .replace("web.hycdn.cn", format!("localhost:{}", cdn_port).as_str())
        .replace(
            format!("{}/api", SIREN_WEBSITE).as_str(),
            format!("localhost:{}", port).as_str(),
        )
        .replace("https", "http");

    for [find, replace] in filter_rules.iter() {
        basic = basic.replace(find, replace);
    }
    basic
}
