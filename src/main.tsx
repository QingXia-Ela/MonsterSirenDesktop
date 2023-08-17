import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// @ts-expect-error: tauri only
if (window.__TAURI_IPC__) {
  function render() {
    ReactDOM.createRoot(document.getElementById("inject-app") as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }

  window.addEventListener("load", () => {
    // inject root app，don't remove!
    if (!document.getElementById("inject-app")) {
      const InjectApp = document.createElement("div");
      InjectApp.id = "inject-app";
      document.body.appendChild(InjectApp);
      console.log('MonsterSirenDesktop Inject App v0.0.1');
    }

    render()
  })

  if (document.getElementById("inject-app")) {
    console.log("Inject hmr update");
    render()
  }
}

else {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}