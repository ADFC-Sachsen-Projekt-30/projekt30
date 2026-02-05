import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  // base path for gh-pages
  base: "projekt30/",
  plugins: [preact()],
  server: {
    allowedHosts: [".ngrok-free.app"],
  },
});
