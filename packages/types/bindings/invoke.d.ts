declare module "@tauri-apps/api/tauri" {
	function invoke<T = any>(cmd: string, args: Record<string, any>): Promise<T>;

}