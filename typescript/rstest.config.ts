import { defineConfig } from "@rstest/core";

export default defineConfig({
  globals: true,
  include: ["src/**/*.test.ts"],
  testEnvironment: "node",
});
