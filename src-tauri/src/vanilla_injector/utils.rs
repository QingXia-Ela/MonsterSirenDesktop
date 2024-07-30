use rodio::{source::Source, Decoder};
use std::io::BufReader;
use std::{fs::File};

/// 获取音频时长，返回毫秒
pub async fn get_audio_duration_from_path(path: &str) -> Option<u64> {
    if let Ok(file) = File::open(path) {
        let file = BufReader::new(file);
        // Decode that sound file into a source
        if let Ok(source) = Decoder::new(file) {
            if let Some(duration) = source.total_duration() {
                return Some(duration.as_millis() as u64);
            }
        }
    }
    None
}

// todo!: finish get audio img cover by id3 or mp4ameta lib, return a base64 string
pub async fn get_audio_cover_from_path(path: &str) -> Option<String> {
    None
}
