pub fn generate_raw_msg(code: u16, msg: &str) -> String {
    format!(r#"{{"code": "{}","msg": "{}"}}"#, code, msg)
}

/// Deserialize range string.
///
/// If end is 0, it means to the end of the file.
pub fn deserialize_range_string(mut header_range: String) -> Option<(u64, u64)> {
    let range = header_range.split('=').collect::<Vec<&str>>();
    if range.len() == 2 {
        let range_type = range.get(0).unwrap();
        let range = range.get(1).unwrap();
        if *range_type == "bytes" {
            let s = range.split('-').collect::<Vec<&str>>();
            if s.len() == 2 {
                let start = s[0].parse::<u64>();
                let end = s[1].parse::<u64>().unwrap_or(0);
                if let Err(_) = start {
                    return None;
                }
                return Some((start.unwrap(), end));
            }
        }
    }

    None
}

#[cfg(test)]
mod deserialize_range_test {
    use super::*;
    #[test]
    fn test_deserialize_range() {
        let result = deserialize_range_string("bytes=0-114514".to_string());
        assert_eq!(result, Some((0, 114514)));

        let result = deserialize_range_string("bytes=114514".to_string());
        assert_eq!(result, None);

        let result = deserialize_range_string("bytes=114514-".to_string());
        assert_eq!(result, Some((114514, 0)));

        let result = deserialize_range_string("bytes=-114514".to_string());
        assert_eq!(result, None);

        assert_eq!(deserialize_range_string(String::from("buf=114-514")), None)
    }
}
