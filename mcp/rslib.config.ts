import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  format: "esm",
  output: {
    filename: {
      js: "index.mjs",
    },
    cleanDistPath: true,
    target: "node",
  },
  plugins: [pluginPublint()],
});
