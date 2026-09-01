rs.mock("ai", () => ({
  tool: (options: unknown) => options,
  zodSchema: (schema: unknown) => schema,
}));

import SumUpAgentToolkit from "./toolkit";

describe("SumUpAgentToolkit approval policy", () => {
  it("requires approval for mutating tools by default", () => {
    const toolkit = new SumUpAgentToolkit({ apiKey: "test-api-key" });
    const tools = toolkit.getTools();

    expect(tools.refund_transaction?.needsApproval).toBe(true);
    expect(tools.create_reader_checkout?.needsApproval).toBe(true);
    expect(tools.get_transaction_v2_1?.needsApproval).toBe(false);
  });

  it("allows callers to override the approval policy", async () => {
    const toolkit = new SumUpAgentToolkit({
      apiKey: "test-api-key",
      approvalPolicy: (tool) => tool.name === "get_transaction_v2_1",
    });
    const needsApproval =
      toolkit.getTools().get_transaction_v2_1?.needsApproval;

    expect(typeof needsApproval).toBe("function");
    if (typeof needsApproval === "function") {
      expect(
        await Promise.resolve(
          needsApproval(
            { merchantCode: "MCODE" },
            {
              toolCallId: "tool-call-id",
              messages: [],
              context: undefined,
            },
          ),
        ),
      ).toBe(true);
    }
  });
});
