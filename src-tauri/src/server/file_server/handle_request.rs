use super::utils::{self, deserialize_range_string};
use crate::Logger;
use futures::lock::Mutex;
use lazy_static::lazy_static;
use reqwest::{
    header::{
        HeaderValue, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_LENGTH, CONTENT_RANGE, CONTENT_TYPE,
    },
    StatusCode,
};
use std::{collections::HashMap, fs, io::Read, sync::Arc};
use warp::{filters::path::FullPath, reply::Response};

lazy_static! {
    static ref CACHE_FILE: Arc<Mutex<HashMap<String, Vec<u8>>>> =
        Arc::new(Mutex::new(HashMap::new()));
}

// todo!: limit file open scope. Add cache.
fn read_file(path: &String) -> Result<Vec<u8>, std::io::Error> {
    Logger::debug(format!("request file path: {}", path).as_str());
    let mut buf = vec![];
    fs::File::open(path)?.read_to_end(&mut buf)?;
    Ok(buf)
}

fn get_not_found_response() -> Response {
    let res = utils::generate_raw_msg(404, "找不到文件哦");
    let mut response = warp::reply::Response::new("".into());

    response
        .headers_mut()
        .insert(ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    response
        .headers_mut()
        .insert(CONTENT_LENGTH, res.len().into());

    *response.status_mut() = StatusCode::NOT_FOUND;
    *response.body_mut() = res.into();

    response
}

fn get_ok_response(file: Vec<u8>, size: u64, file_type: String) -> Response {
    let mut response = warp::reply::Response::new(file.into());
    for (header_name, value) in vec![
        (ACCESS_CONTROL_ALLOW_ORIGIN, "*"),
        (CONTENT_TYPE, file_type.as_str()),
        (CONTENT_LENGTH, format!("{}", size).as_str()),
    ]
    .into_iter()
    {
        response
            .headers_mut()
            .insert(header_name, HeaderValue::from_str(value).unwrap());
    }

    response
}

pub async fn handle_request(
    _: FullPath,
    query: HashMap<String, String>,
    range_value: Option<String>,
    path_alias: Arc<Mutex<HashMap<String, String>>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    let mut response = warp::reply::Response::new("".into());

    if let Some(p) = query.get("path") {
        let mut final_path = p;
        let map = path_alias.lock().await;
        if let Some(alias) = map.get(p) {
            final_path = alias;
        }
        match read_file(final_path) {
            // todo!: support file range send
            Ok(v) => {
                // normal
                let mime = mime_guess::from_path(p).first_or_octet_stream();
                let suf = format!("{}", mime);
                let suf = suf.split('/').last().unwrap();
                let file_size = v.len() as u64;

                // todo!: optimize this shit
                // let expression cannot use continue
                if let Some(range) = range_value {
                    if let Some((start, end)) = deserialize_range_string(range) {
                        if end != 0 || end <= file_size - 1 {
                            // 206 Partial Content
                            let content_range = format!("bytes {}-{}/{}", start, end, file_size);
                            let mut res = get_ok_response(
                                v[start as usize..=(end - 1) as usize].to_vec(),
                                end - start,
                                format!("{}", mime),
                            );
                            *res.status_mut() = StatusCode::PARTIAL_CONTENT;
                            res.headers_mut()
                                .insert(CONTENT_RANGE, content_range.parse().unwrap());

                            return Ok(res);
                        } else {
                            // 200 OK
                            return Ok(get_ok_response(v, file_size, suf.to_string()));
                        }
                    } else {
                        // 200 OK
                        return Ok(get_ok_response(v, file_size, suf.to_string()));
                    }
                } else {
                    // 200 OK
                    return Ok(get_ok_response(v, file_size, suf.to_string()));
                }
            }
            Err(res) => {
                *response.status_mut() = StatusCode::INTERNAL_SERVER_ERROR;
                *response.body_mut() = utils::generate_raw_msg(
                    500,
                    format!("{:?}", res).replace("\"", "\\\"").as_str(),
                )
                .into();
            }
        }
    } else {
        return Ok(get_not_found_response());
    }

    Ok(response)
}
