import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const rootContainer = document.getElementById("root");
if (!rootContainer) {
  throw new Error("Brak #root w dokumencie.");
}

const root = createRoot(rootContainer);
root.render(React.createElement(App));
