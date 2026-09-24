import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type SumUp from "@sumup/sdk";
import { z } from "zod";

rs.mock("../common", () => {
  const actual = rs.requireActual<typeof import("../common")>("../common");
  const { z } = rs.requireActual<typeof import("zod")>("zod");

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
  test("wraps array results with a matching MCP output schema", async () => {
    const result = [{ value: "hello" }];
    const server = new SumUpAgentToolkit({
      configuration: {},
      includeOutputSchemas: true,
      transformTool: (tool) => ({
        ...tool,
        result: z.array(z.object({ value: z.string() })),
        callback: async () => result,
      }),
    });
    const client = new Client({ name: "test-client", version: "1" });
    const [a, b] = InMemoryTransport.createLinkedPair();
    await server.connect(a);
    await client.connect(b);
    try {
      const listed = await client.listTools();
      expect(listed.tools[0]?.outputSchema).toMatchObject({
        type: "object",
        properties: { items: { type: "array", items: { type: "object" } } },
        required: ["items"],
      });
      const response = await client.callTool({
        name: "echo_value",
        arguments: { value: "hello" },
      });
      expect(response.isError).not.toBe(true);
      expect(response.structuredContent).toEqual({ items: result });
      expect(response.content).toEqual([
        { type: "text", text: JSON.stringify({ items: result }) },
      ]);
    } finally {
      await client.close();
      await server.close();
    }
  });
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
