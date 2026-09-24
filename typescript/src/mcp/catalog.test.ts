import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import SumUpAgentToolkit from "./toolkit";

describe("MCP catalog", () => {
  test("exposes reviewed annotations within the agreed context budget", async () => {
    const server = new SumUpAgentToolkit({ configuration: {} });
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const listed = await client.listTools();
      expect(listed.tools.length).toBeGreaterThan(0);
      for (const tool of listed.tools) {
        expect(typeof tool.annotations?.readOnlyHint).toBe("boolean");
        expect(typeof tool.annotations?.openWorldHint).toBe("boolean");
        expect(typeof tool.annotations?.destructiveHint).toBe("boolean");
      }
      expect(
        listed.tools.find((tool) => tool.name === "create_checkout")
          ?.annotations,
      ).toMatchObject({
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      });
      expect(Buffer.byteLength(JSON.stringify(listed))).toBeLessThan(165_000);
    } finally {
      await client.close();
      await server.close();
    }
  });
});
