use colored::*;
use std::time;

fn get_current_time() -> String {
    let current_time = time::SystemTime::now();
    let since_epoch = current_time.duration_since(time::UNIX_EPOCH).unwrap();
    let total_seconds = since_epoch.as_secs();

    let hours = ((total_seconds / 3600) + 8) % 24;
    let minutes = (total_seconds % 3600) / 60;
    let seconds = total_seconds % 60;

    format!("{:02}:{:02}:{:02}", hours, minutes, seconds)
}

pub fn debug(msg: &str) {
    println!("{} {} {}", get_current_time(), "[backend]".blue(), msg)
}

pub fn info(msg: &str) {
    println!(
        "{} {} {}",
        get_current_time(),
        "[backend]".truecolor(50, 183, 216),
        msg
    );
}

pub fn error(msg: &str) {
    println!("{} {} {}", get_current_time(), "[backend]".red(), msg)
}

pub fn warn(msg: &str) {
    println!("{} {} {}", get_current_time(), "[backend]".yellow(), msg)
}
