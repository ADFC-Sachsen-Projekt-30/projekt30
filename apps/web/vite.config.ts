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
    preact()]
});
