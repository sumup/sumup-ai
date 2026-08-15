#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/mcp";

// biome-ignore lint/suspicious/noExplicitAny: just an error handler
function handleError(error: any) {
  console.error("\n🚨  Error initializing SumUp MCP server:\n");
  console.error(`   ${error.message}\n`);
}

async function main() {
  const apiKey = process.env.SUMUP_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("SUMUP_API_KEY environment variable is required");
  }

  const server = new SumUpAgentToolkit({
    apiKey,
    configuration: {},
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio is used for communication, use stderr instead
  console.error("✅ SumUp MCP Server running on stdio");
}

main().catch((error) => {
  handleError(error);
  process.exitCode = 1;
});
