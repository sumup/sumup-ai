import { defineConfig } from "@rslib/core";
import { pluginPublint } from "rsbuild-plugin-publint";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: true,
      redirect: {
        dts: {
          extension: true,
        },
      },
      output: {
        filename: {
          js: "[name]/index.mjs",
        },
      },
    },
    {
      format: "cjs",
      output: {
        filename: {
          js: "[name]/index.cjs",
        },
      },
    },
  ],
  source: {
    tsconfigPath: "./tsconfig.build.json",
    entry: {
      langchain: "./src/langchain/index.ts",
      mcp: "./src/mcp/index.ts",
      openai: "./src/openai/index.ts",
      ai: "./src/ai/index.ts",
    },
  },
  output: {
    target: "node",
    distPath: {
      root: "./dist",
    },
    sourceMap: true,
    cleanDistPath: true,
  },
  plugins: [pluginPublint()],
});
