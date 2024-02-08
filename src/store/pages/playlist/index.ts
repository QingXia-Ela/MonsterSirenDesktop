/**
 * This store use to control page state like left sidebar and right detail list
 */

import { atom } from "nanostores";

const $PlayListState = atom({
  currentListId: "",
  loading: false,
  currentListData: []
})

async function getListData() {

}

export function setCurrentListId(id: string) {
  $PlayListState.set({ ...$PlayListState.get(), currentListId: id, loading: true });
}

export default $PlayListState