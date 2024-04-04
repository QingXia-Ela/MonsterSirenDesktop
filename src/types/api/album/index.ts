export interface AlbumDetail {
  cid: string;
  cnNamespace?: string;
  name: string;
  intro: string;
  belong: string;
  coverUrl: string | null;
  coverDeUrl: string | null;
  songs: Array<{
    cid: string;
    name: string;
    artists: string[];
  }>;
}

export type AlbumData = Omit<AlbumDetail, 'songs'> & {
  artistes: string[];
};

export type AlbumBriefData = Omit<
  AlbumDetail,
  'songs' | 'coverDeUrl' | 'intro' | 'belong'
>;
