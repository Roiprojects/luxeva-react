import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Map Next.js imports to lightweight shims so the ported components run unchanged.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/link": path.resolve(__dirname, "src/shims/link.tsx"),
      "next/image": path.resolve(__dirname, "src/shims/image.tsx"),
      "next/navigation": path.resolve(__dirname, "src/shims/navigation.ts"),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
