import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export const defaultMetadata = Object.freeze({
  namespace: "",
  cnNamespace: "未知",
  color: "rgba(255, 255, 255, 0.2)",
})

export type InjectorMetadata = {
  namespace: string
  cnNamespace: string
  color: string
}

function useInjectorMetadata() {
  const [data, setData] = useState<InjectorMetadata[]>([])

  async function refresh() {
    const data = await invoke("get_all_injector_metadata", {});
    setData(data);
  }

  useEffect(() => {
    refresh()
  }, [])

  return { data, defaultMetadata, refresh }
}

export default useInjectorMetadata