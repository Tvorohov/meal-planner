import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSync } from "./lib/sync";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Sync with Supabase if configured (no-op otherwise).
void initSync();
