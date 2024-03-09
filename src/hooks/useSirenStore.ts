import SirenStore from '@/store/SirenStore';
import { SirenStoreState } from '@/types/SirenStore';
import { useState } from 'react';

const setStoreCall = new Set<any>();

SirenStore.subscribe(() => {
  const state = SirenStore.getState();

  setStoreCall.forEach((v) => v(state));
});

// todo!: 没有处理热重载的情况，集合仍然会调用之前可能不需要的 setStore 函数，导致内存占用
export default function useSirenStore<T = any>(
  fn: (state: SirenStoreState) => T,
): T {
  // filter fn
  const [store, setStore] = useState(fn(SirenStore.getState()));

  // filter fn
  setStoreCall.add((state: SirenStoreState) => setStore(fn(state)));

  return store;
}
