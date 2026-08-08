import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { hydratePublicContent } from "./lib/content-client";

// Enable reveal-on-scroll animations (progressive enhancement — visible without JS).
document.documentElement.classList.add("js-reveal");

await hydratePublicContent();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
