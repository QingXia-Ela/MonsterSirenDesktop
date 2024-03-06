/**
 * This store use to control page state like right detail list
 */

import { getAlbumData, getAlbums } from '@/api/modules/album';
import { atom } from 'nanostores';
import { AlbumBriefData, AlbumData } from '@/types/api/album';

const $PlayListState = atom<{
  currentListId: string;
  loading: boolean;
  currentListData: Array<unknown>;
  fetchedAlbumList: boolean;
  albumList: AlbumData['songs'];
}>({
  currentListId: '',
  loading: false,
  currentListData: [],
  fetchedAlbumList: false,
  albumList: [],
});

async function getListData(id: string) {
  return (await (await getAlbumData(id)).json()) as AlbumData;
}

async function getAlbumListData() {
  return (await (await getAlbums()).json()) as AlbumBriefData[];
}

const albumIdReg = /(\w+):(.+)/;

function parseAlbumData(albumList: AlbumBriefData[]) {
  const map: Record<string, AlbumBriefData[]> = {};

  albumList.forEach((item) => {
    if (!albumIdReg.test(item.cid)) return;

    const [, type] = albumIdReg.exec(item.cid)!;
    if (!map[type]) map[type] = [] as AlbumBriefData[];
    map[type].push(item);
  });
}

export async function updateAlbumList() {
  const data = await getAlbumListData();

  // $PlayListState.set({
  //   ...$PlayListState.get(),
  //   albumList: data,
  // });
}

export async function setCurrentListId(id: string) {
  $PlayListState.set({
    ...$PlayListState.get(),
    currentListId: id,
    loading: true,
  });

  const res = await getListData(id);

  $PlayListState.set({
    ...$PlayListState.get(),
    currentListData: res.songs,
    loading: false,
  });
}

export default $PlayListState;
