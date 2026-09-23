import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { OpenAPIV3_1 } from "openapi-types";
import { generate } from "./generator.js";

function spec(operationId: string): OpenAPIV3_1.Document {
  return {
    openapi: "3.1.0",
    info: { title: "Test", version: "1" },
    paths: {
      "/test": {
        post: {
          operationId,
          tags: ["Test"],
          description: "Refunds the specified transaction.",
          responses: { "200": { description: "Success" } },
        },
      },
    },
  };
}

test("generates reviewed hints and preserves the API description", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));

  await generate(spec("RefundTransaction"), { outputDir });
  const source = await readFile(join(outputDir, "test/tools.ts"), "utf8");
  assert.match(source, /Refunds the specified transaction\./);
  assert.match(source, /readOnly: false/);
  assert.match(source, /openWorld: false/);
  assert.match(source, /destructive: true/);
  const registry = await readFile(join(outputDir, "registry.ts"), "utf8");
  assert.match(registry, /export type ToolName = "refund_transaction";/);
});

test("rejects an unreviewed operation before writing files", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));

  await assert.rejects(
    generate(spec("SendNewMessage"), { outputDir }),
    /Review tool annotations/,
  );
  assert.deepEqual(await readdir(outputDir), []);
});
