use colored::*;
use std::time;
pub struct Logger {}

impl Logger {
    pub fn new() -> Self {
        Self {}
    }

    fn get_current_time(&self) -> String {
        let current_time = time::SystemTime::now();
        let since_epoch = current_time.duration_since(time::UNIX_EPOCH).unwrap();
        let total_seconds = since_epoch.as_secs();

        let hours = ((total_seconds / 3600) + 8) % 24;
        let minutes = (total_seconds % 3600) / 60;
        let seconds = total_seconds % 60;

        format!("{:02}:{:02}:{:02}", hours, minutes, seconds)
    }

    pub fn info(&self, msg: &str) {
        println!(
            "{} {} {}",
            self.get_current_time(),
            "[tauri-hmr]".truecolor(50, 183, 216),
            msg
        );
    }

    pub fn error(&self, msg: &str) {
        println!(
            "{} {} {}",
            self.get_current_time(),
            "[tauri-hmr]".red(),
            msg
        )
    }

    pub fn warn(&self, msg: &str) {
        println!(
            "{} {} {}",
            self.get_current_time(),
            "[tauri-hmr]".yellow(),
            msg
        )
    }
}
