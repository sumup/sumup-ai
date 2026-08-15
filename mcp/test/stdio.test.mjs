import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("serves the tool catalog over stdio", { timeout: 15_000 }, async () => {
  const server = spawn(process.execPath, ["dist/index.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SUMUP_API_KEY: "test-api-key",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stderr = "";
  server.stderr.setEncoding("utf8");
  server.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const pending = new Map();
  let stdoutBuffer = "";
  server.stdout.setEncoding("utf8");
  server.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk;
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line) continue;
      const message = JSON.parse(line);
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    }
  });

  const request = (message) =>
    new Promise((resolve, reject) => {
      pending.set(message.id, resolve);
      server.stdin.write(`${JSON.stringify(message)}\n`, (error) => {
        if (error) reject(error);
      });
    });

  try {
    const initialized = await request({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "stdio-test", version: "1.0.0" },
      },
    });
    assert.equal(initialized.result.serverInfo.name, "SumUp");

    server.stdin.write(
      `${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`,
    );
    const listed = await request({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });

    assert.ok(listed.result.tools.length > 0);
  } finally {
    server.kill();
    await new Promise((resolve) => server.once("close", resolve));
  }

  assert.match(stderr, /SumUp MCP Server running on stdio/);
});
