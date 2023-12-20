use brotlic::{
    decode::{DecodeError, DecodeResult},
    BrotliDecoder,
};
use tauri::Manager;

pub fn decode_brotli(body: &[u8]) -> Result<Vec<u8>, DecodeError> {
    // let mut decompressor = DecompressorReader::new([u8; 1024]);
    let mut decoder = BrotliDecoder::new();
    let mut res = [0; 114514];
    let res: Result<DecodeResult, brotlic::decode::DecodeError> =
        decoder.decompress(body, &mut res);
    match res {
        Ok(_) => Ok(unsafe { decoder.take_output() }.unwrap().to_vec()),
        Err(dec_err) => Err(dec_err),
    }
}

pub fn get_main_window(app: &tauri::AppHandle) -> tauri::Window {
    app.get_window("main").unwrap()
}
