import SirenStore from "@/store/SirenStore";
import { SirenStoreState } from "@/types/SirenStore";
import { useState } from "react";

const setStoreCall = new Set<any>()

SirenStore.subscribe(() => {
  const state = SirenStore.getState()

  setStoreCall.forEach((v) => v(state))
})

export default function useSirenStore<T = any>(fn: (state: SirenStoreState) => T): T {
  // filter fn
  const [store, setStore] = useState(fn(SirenStore.getState()))

  // filter fn
  setStoreCall.add((state: SirenStoreState) => setStore(fn(state)))

  return store
}