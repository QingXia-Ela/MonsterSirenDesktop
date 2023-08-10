import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
// inject root app，don't remove!
if (!document.getElementById("inject-app")) {
  const InjectApp = document.createElement("div");
  InjectApp.id = "inject-app";
  document.body.appendChild(InjectApp);
}

ReactDOM.createRoot(document.getElementById("inject-app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
