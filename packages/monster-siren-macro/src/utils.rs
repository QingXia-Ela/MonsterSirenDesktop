pub fn get_plugin_str(namespace: &String, name: &String) -> String {
    // doesn't have namespace, just return name
    if namespace.len() == 0 {
        return format!("{}", name);
    }
    format!("plugin:{}|{}", namespace, name)
}

pub fn parse_type_2_ts<'a>(type_str: &'a String) -> &'static str {
    match type_str.as_str() {
        "String" => "string",
        _ => "any",
    }
}
