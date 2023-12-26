// const SONGS_REGEX: &str = r"^/song/(\d+)$";
// const ALBUMS_REGEX: &str = r"^/album/(\d+)/data$";

#[derive(PartialEq, Eq)]
pub enum SirenApiPath {
    /// Get all songs
    ///
    /// `/songs`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#歌曲列表)
    Songs,
    /// Get song detail by id
    ///
    /// `/song/{id}`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#歌曲基本信息)
    SongId,
    /// Get all albums
    ///
    /// `/albums`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#所有专辑列表)
    Albums,
    /// Get album data by id
    ///
    /// `/album/{id}/data`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#专辑数据信息)
    AlbumIdData,
    /// Get album detail by id
    ///
    /// `/album/{id}/detail`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#专辑详细信息)
    AlbumIdDetail,
    /// Get info page swiper data
    ///
    /// `/recommends`
    ///
    /// See [Docs](https://github.com/QingXia-Ela/MonsterSirenApi/blob/main/docs/dev/接口一览.md#轮播图数据)
    Recommends,
}
