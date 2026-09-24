import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
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
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["amount"],
                  properties: {
                    amount: {
                      type: "number",
                      description: "Amount in major units.",
                    },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Success" } },
        },
      },
    },
  };
}

test("generates only schemas and preserves handwritten files on regeneration", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const handwritten = "// Handwritten tool registration\n";
  await writeFile(join(outputDir, "registry.ts"), handwritten);
  await generate(spec("NewOperation"), { outputDir });
  const source = await readFile(join(outputDir, "test.ts"), "utf8");
  assert.match(source, /export const newOperationParameters/);
  assert.match(source, /Amount in major units/);
  assert.match(source, /export const newOperationResult/);
  assert.deepEqual((await readdir(outputDir)).sort(), [
    "registry.ts",
    "test.ts",
  ]);

  const renamed = spec("NewOperation");
  renamed.paths!["/test"]!.post!.tags = ["Renamed"];
  await generate(renamed, { outputDir });
  assert.deepEqual((await readdir(outputDir)).sort(), [
    "registry.ts",
    "renamed.ts",
  ]);
  assert.equal(
    await readFile(join(outputDir, "registry.ts"), "utf8"),
    handwritten,
  );
});

test("omits excluded operations from generated schemas", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "sumup-codegen-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));
  const input = spec("RefundTransaction");
  await generate(input, { outputDir });
  const expected = await readFile(join(outputDir, "test.ts"), "utf8");
  for (const operationId of [
    "ProcessCheckout",
    "DeactivatePaymentInstrument",
    "GetPaymentMethods",
    "CreateApplePaySession",
  ]) {
    input.paths![`/${operationId}`] = spec(operationId).paths!["/test"]!;
  }
  await generate(input, { outputDir });
  assert.equal(await readFile(join(outputDir, "test.ts"), "utf8"), expected);
});
