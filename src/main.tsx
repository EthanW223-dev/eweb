import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// StrictMode intentionally omitted: it double-mounts every component in dev,
// which doubles WebGL context creation (ASCII + shader + showcase backgrounds)
// and triggers a context-loss storm that crashes the GPU.
createRoot(document.getElementById("root")!).render(<App />);
