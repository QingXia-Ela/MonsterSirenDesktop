// use brotlic::decode::{DecodeError, DecodeResult};
use tauri::{Manager, Runtime};

use crate::constants::AUDIO_SUFFIX;

pub fn decode_brotli(_body: &[u8]) -> Result<Vec<u8>, ()> {
    // let mut decompressor = DecompressorReader::new([u8; 1024]);
    todo!("use other brotli decoder");
    // let mut decoder = BrotliDecoder::new();
    // let mut res = [0; 114514];
    // let res: Result<DecodeResult, brotlic::decode::DecodeError> =
    //     decoder.decompress(body, &mut res);
    // match res {
    //     Ok(_) => Ok(unsafe { decoder.take_output() }.unwrap().to_vec()),
    //     Err(dec_err) => Err(dec_err),
    // }
}

pub fn get_main_window<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Window<R> {
    app.get_window("main").unwrap()
}

pub fn is_audio_suffix(path: Option<&str>) -> bool {
    match path {
        Some(path) => AUDIO_SUFFIX.iter().any(|suffix| path.ends_with(suffix)),
        None => false,
    }
}

#[cfg(test)]
mod global_utils_test {
    use super::*;
    #[test]
    pub fn audio_suffix_judge() {
        assert!(is_audio_suffix(Some("test.mp3")));
    }
}
