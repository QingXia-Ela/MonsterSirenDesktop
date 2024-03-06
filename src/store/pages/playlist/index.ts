/**
 * This store use to control page state like right detail list
 */

import { getAlbumData, getAlbums } from '@/api/modules/album';
import { atom } from 'nanostores';
import { AlbumData } from '@/types/api/album';

const $PlayListState = atom<{
  currentListId: string
  loading: boolean
  currentListData: Array<unknown>
  fetchedAlbumList: boolean
  albumList: AlbumData['songs']
}>({
  currentListId: '',
  loading: false,
  currentListData: [],
  fetchedAlbumList: false,
  albumList: []
});

async function getListData(id: string) {
  return await (await getAlbumData(id)).json() as AlbumData
}

async function getAlbumListData() {
  return await (await getAlbums()).json()
}

const albumIdReg = /(\w+):(.+)/

function parseAlbumData(albumList: unknown) {
  const map = {}

}

export async function updateAlbumList() {
  const data = await getAlbumListData()
  console.log(data);

}

export async function setCurrentListId(id: string) {
  $PlayListState.set({
    ...$PlayListState.get(),
    currentListId: id,
    loading: true,
  });

  const res = await getListData(id);
  console.log(res);

  $PlayListState.set({
    ...$PlayListState.get(),
    currentListData: res.songs,
    loading: false,
  });
}

updateAlbumList()

export default $PlayListState;
