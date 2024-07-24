/**
 * This store use to control page state like right detail list
 */

import { getAlbumDetail, getAlbums } from '@/api/modules/album';
import { atom } from 'nanostores';
// todo!: 迁移至 `@monster-siren-desktop/types` 包下
import { AlbumBriefData, AlbumData, AlbumDetail } from '@/types/api/album';
import { SirenStoreState } from '@/types/SirenStore';
import SirenStore from '@/store/SirenStore';

const {
  musicPlay: { albumDetail },
} = SirenStore.getState();

const $PlayListState = atom<{
  currentAlbumId: string;
  loading: boolean;
  status: 'pending' | 'ok' | 'error' | 'init';
  currentAlbumInfo: AlbumData;
  currentAlbumData: SirenStoreState['player']['list'];
  fetchedAlbumList: boolean;
  albumList: AlbumDetail['songs'];
}>({
  currentAlbumId: albumDetail.cid,
  loading: false,
  status: 'init',
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

let lastOpId: string;
let timer: any;
/**
 * @param id 专辑 id
 */
export async function setCurrentAlbumId(id: string) {
  // 防止上一个 Promise 未完成但是下一个 Promise 已经被触发导致的数据覆盖
  timer = +new Date();
  lastOpId = id;
  $PlayListState.set({
    ...$PlayListState.get(),
    status: 'pending',
    currentAlbumId: id,
    loading: true,
  });

  // todo!: add type declare
  try {
    const [{ data: res }, info] = await Promise.all([
      getListData(id),
      getAlbumData(id),
    ]);
    let end_req_time = /* 1.5 sec at least wait */ 1000 + +new Date() - timer;
    setTimeout(
      () => {
        if (!info) {
          $PlayListState.set({
            ...$PlayListState.get(),
            status: 'error',
            loading: false,
          });
          return;
        }

        if (lastOpId === id) {
          $PlayListState.set({
            ...$PlayListState.get(),
            status: 'ok',
            currentAlbumData: res.songs,
            currentAlbumInfo: info,
            loading: false,
          });
        }
      },
      end_req_time > 0 ? end_req_time : 0,
    );
  } catch (e) {
    $PlayListState.set({
      ...$PlayListState.get(),
      status: 'error',
      loading: false,
    });
  }
}

export function clearCurrentAlbum() {
  const { albumList, currentAlbumInfo } = $PlayListState.get();
  $PlayListState.set({
    currentAlbumId: '',
    currentAlbumData: [],
    status: 'init',
    loading: false,
    currentAlbumInfo,
    fetchedAlbumList: false,
    albumList,
  });
}

export default $PlayListState;
