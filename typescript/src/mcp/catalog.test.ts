import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import SumUpAgentToolkit from "./toolkit";

describe("MCP catalog budget", () => {
  test("keeps tools/list within the agreed context budget", async () => {
    const server = new SumUpAgentToolkit({ configuration: {} });
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const listed = await client.listTools();
      expect(listed.tools.length).toBeGreaterThan(0);
      expect(Buffer.byteLength(JSON.stringify(listed))).toBeLessThan(165_000);
    } finally {
      await client.close();
      await server.close();
    }
  });
});
