declare module "@tauri-apps/api/tauri" {
	function invoke(cmd: "plugin:playlist|add_playlist", args: { app: any, manager: any, name: string, }): Promise<any>;

}