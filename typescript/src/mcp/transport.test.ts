import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type SumUp from "@sumup/sdk";

jest.mock("../common", () => {
  const actual = jest.requireActual("../common");
  const { z } = jest.requireActual("zod");

  return {
    ...actual,
    registerTools: (
      reg: (tool: {
        name: string;
        title: string;
        description: string;
        parameters: ReturnType<typeof z.object>;
        result: ReturnType<typeof z.object>;
        callback: (sumup: SumUp, input: { value: string }) => Promise<unknown>;
      }) => void,
    ) =>
      reg({
        name: "echo_value",
        title: "Echo value",
        description: "Returns the supplied value",
        parameters: z.object({ value: z.string() }),
        result: z.object({ value: z.string() }),
        callback: async (_sumup: SumUp, input: { value: string }) => ({
          value: input.value,
        }),
      }),
  };
});

import SumUpAgentToolkit from "./toolkit";

describe("MCP transport contract", () => {
  test("lists and calls tools through the MCP client transport", async () => {
    const server = new SumUpAgentToolkit({
      apiKey: "test-api-key",
      configuration: {},
    });
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const listed = await client.listTools();
      expect(listed.tools.map((tool) => tool.name)).toEqual(["echo_value"]);

      await expect(
        client.callTool({
          name: "echo_value",
          arguments: { value: "hello" },
        }),
      ).resolves.toMatchObject({
        structuredContent: { value: "hello" },
      });

      await expect(
        client.callTool({
          name: "echo_value",
          arguments: { value: 42 },
        }),
      ).resolves.toMatchObject({ isError: true });
    } finally {
      await client.close();
      await server.close();
    }
  });
});
