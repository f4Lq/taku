import React from "react";
import { createRoot } from "react-dom/client";

window.React = React;
window.ReactDOM = { createRoot };

const appVersion = "20260430-react-1";
const existingScript = document.querySelector('script[data-app-loader="legacy-react"]');

if (!existingScript) {
  const script = document.createElement("script");
  script.src = `/js/app.js?v=${encodeURIComponent(appVersion)}`;
  script.defer = true;
  script.dataset.appLoader = "legacy-react";
  document.head.appendChild(script);
}
