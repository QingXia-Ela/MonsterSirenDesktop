import SirenStore from '@/store/SirenStore';
import { SirenStoreState } from '@/types/SirenStore';
import { useState } from 'react';

const setStoreCall = new Set<any>();

SirenStore.subscribe(() => {
  const state = SirenStore.getState();

  setStoreCall.forEach((v) => v(state));
});

// todo!: 没有处理热重载的情况，集合仍然会调用之前可能不需要的 setStore 函数
/**
 * 原生页面 store 的值变化监听函数
 *
 * 底层是直接通过 subscribe 订阅 store 的变化，传入函数可以辅助提取值
 *
 * @example
 * ```ts
 * const store = useSirenStore() // 获取所有状态
 * const store = useSirenStore(state => state.musicPlay) // 获取部分状态
 * ```
 * @param fn 过滤函数
 * @returns 过滤后的值
 */
export default function useSirenStore<T = SirenStoreState>(
  fn: (state: SirenStoreState) => T = (state) => state as any,
): T {
  // filter fn
  const [store, setStore] = useState(fn(SirenStore.getState()));

  // filter fn
  setStoreCall.add((state: SirenStoreState) => setStore(fn(state)));

  return store;
}
