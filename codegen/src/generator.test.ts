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

test("omits excluded operations from all generated code", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const input = spec("RefundTransaction");
  for (const operationId of [
    "ProcessCheckout",
    "DeactivatePaymentInstrument",
    "GetPaymentMethods",
    "CreateApplePaySession",
  ]) {
    input.paths![`/${operationId}`] = spec(operationId).paths!["/test"]!;
  }

  await generate(input, {
    outputDir,
  });
  // Compare the entire output with a spec containing only the retained operation.
  const expectedDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(expectedDir, { recursive: true, force: true }));
  await generate(spec("RefundTransaction"), { outputDir: expectedDir });
  for (const file of [
    "registry.ts",
    "test/index.ts",
    "test/tools.ts",
    "test/parameters.ts",
  ]) {
    assert.equal(
      await readFile(join(outputDir, file), "utf8"),
      await readFile(join(expectedDir, file), "utf8"),
    );
  }
});
