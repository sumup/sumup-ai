import SumUpAgentToolkit from "./toolkit";

describe("SumUpAgentToolkit approval policy", () => {
  it("requires approval for mutating tools by default", async () => {
    const tools = new SumUpAgentToolkit({
      apiKey: "test-api-key",
    }).getTools();
    const byName = new Map(tools.map((tool) => [tool.name, tool]));

    const requiresApproval = async (name: string) => {
      const needsApproval = byName.get(name)?.needsApproval;
      return typeof needsApproval === "function"
        ? await needsApproval({} as never, {})
        : needsApproval;
    };

    await expect(requiresApproval("refund_transaction")).resolves.toBe(true);
    await expect(requiresApproval("create_reader_checkout")).resolves.toBe(
      true,
    );
    await expect(requiresApproval("get_transaction_v2_1")).resolves.toBe(false);
  });

  it("allows callers to override the approval policy", async () => {
    const tools = new SumUpAgentToolkit({
      apiKey: "test-api-key",
      approvalPolicy: (tool) => tool.name === "get_transaction_v2_1",
    }).getTools();
    const needsApproval = tools.find(
      (tool) => tool.name === "get_transaction_v2_1",
    )?.needsApproval;

    expect(typeof needsApproval).toBe("function");
    if (typeof needsApproval === "function") {
      await expect(
        needsApproval({} as never, { merchantCode: "MCODE" }),
      ).resolves.toBe(true);
    }
  });
});
