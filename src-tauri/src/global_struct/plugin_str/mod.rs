type Test = unsafe extern "C" fn() -> PluginStr;

// ffi-save str
#[repr(C)]
#[derive(Debug, Clone, Copy)]
pub struct PluginStr {
    p: *const u8,
    len: usize,
}

impl PluginStr {
    pub fn new(p: *const u8, len: usize) -> Self {
        Self { p, len }
    }

    pub unsafe fn get_str(&self) -> String {
        let slice = std::slice::from_raw_parts(self.p, self.len);
        String::from_utf8_unchecked(slice.to_vec())
    }
}

impl From<String> for PluginStr {
    fn from(s: String) -> Self {
        Self {
            p: s.as_ptr(),
            len: s.len(),
        }
    }
}
