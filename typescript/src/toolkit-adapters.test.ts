import type SumUp from "@sumup/sdk";

const mockToolState = {
  callback: async (_sumup: SumUp, input: { value: string }) => ({
    value: input.value,
  }),
};

rs.mock("ai", () => ({
  tool: (options: unknown) => options,
  zodSchema: (schema: unknown) => schema,
}));

rs.mock("./common", () => {
  const actual = rs.requireActual<typeof import("./common")>("./common");
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
        callback: typeof mockToolState.callback;
      }) => void,
    ) =>
      reg({
        name: "echo_value",
        title: "Echo value",
        description: "Returns the supplied value",
        parameters: z.object({ value: z.string() }),
        result: z.object({ value: z.string() }),
        callback: async (sumup: SumUp, input: { value: string }) =>
          mockToolState.callback(sumup, input),
      }),
  };
});

import AiSdkToolkit from "./ai/toolkit";
import LangChainToolkit from "./langchain/toolkit";
import OpenAiToolkit from "./openai/toolkit";

describe("agent framework adapter contracts", () => {
  beforeEach(() => {
    mockToolState.callback = async (_sumup, input) => ({ value: input.value });
  });

  test("AI SDK tools execute callbacks and validate results", async () => {
    const tool = new AiSdkToolkit({ apiKey: "test-api-key" }).getTools()
      .echo_value;
    if (!tool?.execute) throw new Error("AI SDK tool is not executable");

    await expect(
      tool.execute(
        { value: "hello" },
        {
          toolCallId: "tool-call-id",
          messages: [],
          abortSignal: new AbortController().signal,
          context: undefined,
        },
      ),
    ).resolves.toEqual({ value: "hello" });

    mockToolState.callback = async () =>
      ({ value: 42 }) as unknown as { value: string };
    await expect(
      tool.execute(
        { value: "hello" },
        {
          toolCallId: "tool-call-id",
          messages: [],
          abortSignal: new AbortController().signal,
          context: undefined,
        },
      ),
    ).rejects.toThrow();
  });

  test("LangChain tools validate inputs and results", async () => {
    const tool = new LangChainToolkit({
      apiKey: "test-api-key",
    }).getTools()[0];
    if (!tool) throw new Error("LangChain tool was not registered");

    await expect(tool.invoke({ value: "hello" })).resolves.toEqual({
      value: "hello",
    });
    await expect(tool.invoke({ value: 42 })).rejects.toThrow();

    mockToolState.callback = async () =>
      ({ value: 42 }) as unknown as { value: string };
    await expect(tool.invoke({ value: "hello" })).rejects.toThrow();
  });

  test("OpenAI Agents tools execute callbacks and validate results", async () => {
    const tool = new OpenAiToolkit({
      apiKey: "test-api-key",
    })
      .getTools()
      .find((candidate) => candidate.name === "echo_value");
    if (tool?.type !== "function") {
      throw new Error("OpenAI function tool was not registered");
    }

    await expect(
      tool.invoke({} as never, JSON.stringify({ value: "hello" })),
    ).resolves.toEqual({ value: "hello" });

    mockToolState.callback = async () =>
      ({ value: 42 }) as unknown as { value: string };
    await expect(
      tool.invoke({} as never, JSON.stringify({ value: "hello" })),
    ).resolves.toEqual(expect.any(String));
  });
});
