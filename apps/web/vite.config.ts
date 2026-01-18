import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import {stringPlugin} from "vite-string-plugin";
//import parseFilePlugin from "./vite-plugin-parse-file";
// https://vite.dev/config/
export default defineConfig({
  // base path for gh-pages
  base: "projekt30/",
  plugins: [ 
    stringPlugin(),
    preact()], 
  server: {
    proxy: {
      '/sachsen-schul-api': {
        target: 'https://schuldatenbank.sachsen.de/api', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sachsen-schul-api/, ''),
        headers: {
          'Access-Control-Allow-origin': '*',
        }
      }
    }
  }
});
