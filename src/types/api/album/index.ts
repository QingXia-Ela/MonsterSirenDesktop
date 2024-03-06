export interface AlbumData {
  cid: string
  name: string
  intro: string
  belong: string
  coverUrl: string | null
  coverDeUrl: string | null
  songs: Array<{
    cid: string
    name: string
    artists: string[]
  }>
}