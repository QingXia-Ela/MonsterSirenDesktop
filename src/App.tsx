import { createRef, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import InjectLayout from "./layout";
import useBackground from "./hooks/useBackground";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const MonsterSirenCore = createRef<HTMLIFrameElement>();

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet!", { name }));
  }

  return (
    // <div className="container">
    //   111

    //   <form
    //     className="row"
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       greet();
    //     }}
    //   >
    //     <input
    //       id="greet-input"
    //       onChange={(e) => setName(e.currentTarget.value)}
    //       placeholder="Enter a name..."
    //     />
    //     <button type="submit">Greet</button>
    //   </form>

    //   <p>{greetMsg}</p>
    // </div>
    <>
      {/* {
        !window.__TAURI_IPC__ && <iframe id="MonsterSirenCore" className="w-full h-full p-0.5 bg-black" src="https://monster-siren.hypergryph.com" frameBorder={0} ref={MonsterSirenCore} referrerPolicy="no-referrer"></iframe>
      } */}
      <InjectLayout></InjectLayout>
    </>
  );
}

export default App;
