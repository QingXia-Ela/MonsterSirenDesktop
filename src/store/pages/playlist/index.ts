/**
 * This store use to control page state like right detail list
 */

import { getAlbumDetail, getAlbums } from '@/api/modules/album';
import { atom } from 'nanostores';
import { AlbumBriefData, AlbumData, AlbumDetail } from '@/types/api/album';
import { SirenStoreState } from '@/types/SirenStore';
import SirenStore from '@/store/SirenStore';

const {
  musicPlay: { albumDetail },
} = SirenStore.getState();

const $PlayListState = atom<{
  currentAlbumId: string;
  loading: boolean;
  currentAlbumInfo: AlbumData;
  currentAlbumData: SirenStoreState['player']['list'];
  fetchedAlbumList: boolean;
  albumList: AlbumDetail['songs'];
}>({
  currentAlbumId: albumDetail.cid,
  loading: false,
  // todo!: remove artistes and change to correct type
  currentAlbumInfo: { ...albumDetail, artistes: [] },
  currentAlbumData: [],
  fetchedAlbumList: false,
  albumList: [],
});

/**
 * 获取当前专辑的信息（不包含歌曲）
 *
 * @param id 专辑 id
 */
async function getAlbumData(id: string) {
  return (await (await getAlbumDetail(id)).json()).data as AlbumData;
}

async function getListData(id: string) {
  return await (await getAlbumDetail(id)).json();
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

export async function setCurrentAlbumId(id: string) {
  $PlayListState.set({
    ...$PlayListState.get(),
    currentAlbumId: id,
    loading: true,
  });

  // todo!: add type declare
  const [{ data: res }, info] = await Promise.all([
    getListData(id),
    getAlbumData(id),
  ]);

  $PlayListState.set({
    ...$PlayListState.get(),
    currentAlbumData: res.songs,
    currentAlbumInfo: info,
    loading: false,
  });
}

export default $PlayListState;
