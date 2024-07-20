declare module "@tauri-apps/api/tauri" {
	function invoke<T>(cmd: string, args: Record<string, any>): Promise<T>;
	function invoke(cmd: "plugin:playlist|add_playlist", args: { name: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_playlist", args: { name: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_song_to_playlist", args: { playlist_id: string, song: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_song_to_playlist", args: { playlist_id: string, song: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_all_playlists", args: {}): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_all_playlists", args: {}): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_playlist", args: { playlist_id: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_playlist", args: { playlist_id: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_song", args: { playlist_id: string, cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_song", args: { playlist_id: string, cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_playlist", args: { playlist_id: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_playlist", args: { playlist_id: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_song_from_playlist", args: { playlist_id: string, song_cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_song_from_playlist", args: { playlist_id: string, song_cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_playlist_metadata", args: { playlist_id: string, metadata: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_playlist_metadata", args: { playlist_id: string, metadata: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_songs_in_playlist", args: { playlist_id: string, songs: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_songs_in_playlist", args: { playlist_id: string, songs: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_song", args: { playlist_id: string, old_song_cid: string, new_song: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_song", args: { playlist_id: string, old_song_cid: string, new_song: any, }): Promise<any>;

}