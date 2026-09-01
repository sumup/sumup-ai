import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "esnext",
      output: {
        filename: {
          js: "index.mjs",
        },
      },
    },
  ],
  output: {
    cleanDistPath: true,
    target: "node",
  },
  plugins: [pluginPublint()],
});
