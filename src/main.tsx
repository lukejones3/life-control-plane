import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./recruiter.css";
import "./buildStudio.css";
import "./contentStudio.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  const authMode = import.meta.env.VITE_PLATFORM_AUTH === "true" ? "platform" : "local-demo";
  window.addEventListener("load", () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?auth=${authMode}`));
}
