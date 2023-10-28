import { createRef, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import InjectLayout from "./layout";
import useBackground from "./hooks/useBackground";
import SirenCustomView from "@/router/core/CustomView";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const MonsterSirenCore = createRef<HTMLIFrameElement>();

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet!", { name }));
  }

  return (
    <>
      <InjectLayout></InjectLayout>
      <SirenCustomView />
    </>
  );
}

export default App;
