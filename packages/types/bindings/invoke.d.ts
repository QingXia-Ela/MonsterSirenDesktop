declare module "@tauri-apps/api/tauri" {
	function invoke<T>(cmd: string, args: Record<string, any>): Promise<T>;
	function invoke(cmd: "plugin:playlist|add_playlist", args: { name: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_playlist", args: { name: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_song_to_playlist", args: { playlistId: string, song: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|add_song_to_playlist", args: { playlistId: string, song: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_all_playlists", args: { }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_all_playlists", args: { }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_playlist", args: { playlistId: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_playlist", args: { playlistId: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_song", args: { playlistId: string, cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|get_song", args: { playlistId: string, cid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_playlist", args: { playlistId: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_playlist", args: { playlistId: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_song_from_playlist", args: { playlistId: string, songCid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|remove_song_from_playlist", args: { playlistId: string, songCid: string, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_playlist_metadata", args: { playlistId: string, metadata: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_playlist_metadata", args: { playlistId: string, metadata: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_songs_in_playlist", args: { playlistId: string, songs: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_songs_in_playlist", args: { playlistId: string, songs: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_song", args: { playlistId: string, oldSongCid: string, newSong: any, }): Promise<any>;
	function invoke(cmd: "plugin:playlist|update_song", args: { playlistId: string, oldSongCid: string, newSong: any, }): Promise<any>;

}