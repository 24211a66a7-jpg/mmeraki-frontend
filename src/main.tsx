import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Silence specific noisy warnings/errors in console (dev only)
if (import.meta.env.DEV) {
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);
  const ignore = [
    /React Router Future Flag Warning/i,
    /stagewise/i,
    /Attempting to reconnect/i,
    /WebSocket closed intentionally/i,
  ];
  console.warn = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    if (ignore.some((re) => re.test(msg))) return;
    originalWarn(...args);
  };
  console.error = (...args: any[]) => {
    const msg = String(args[0] ?? '');
    if (ignore.some((re) => re.test(msg))) return;
    originalError(...args);
  };
}

// Render the main app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
