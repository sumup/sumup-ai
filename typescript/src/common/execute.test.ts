import type SumUp from "@sumup/sdk";
import { z } from "zod";
import { executeTool, type ToolObservability } from "./execute";
import type { Tool } from "./types";

const parameters = z.object({ value: z.string() });
const result = z.object({ value: z.string() });
const tool: Tool<typeof parameters, typeof result> = {
  name: "echo_value",
  title: "Echo value",
  description: "Returns the supplied value",
  parameters,
  result,
  callback: async (_sumup, input) => ({ value: input.value }),
};
const sumup = {} as SumUp;

describe("executeTool", () => {
  test("reports successful execution without exposing input or output", async () => {
    const events: unknown[] = [];
    const observability: ToolObservability = {
      onToolStart: (event) => {
        events.push(event);
      },
      onToolEnd: (event) => {
        events.push(event);
      },
    };

    await expect(
      executeTool(tool, sumup, { value: "sensitive" }, observability),
    ).resolves.toEqual({ value: "sensitive" });
    expect(events).toHaveLength(2);
    expect(events).toEqual([
      expect.objectContaining({ toolName: "echo_value" }),
      expect.objectContaining({
        toolName: "echo_value",
        durationMs: expect.any(Number),
      }),
    ]);
    expect(JSON.stringify(events)).not.toContain("sensitive");
  });

  test("reports failures and preserves the original error", async () => {
    const error = new Error("tool failed");
    const failingTool = {
      ...tool,
      callback: async () => {
        throw error;
      },
    };
    const onToolError = rs.fn();

    await expect(
      executeTool(failingTool, sumup, { value: "hello" }, { onToolError }),
    ).rejects.toBe(error);
    expect(onToolError).toHaveBeenCalledWith(
      expect.objectContaining({ toolName: "echo_value", error }),
    );
  });

  test("does not let observability failures affect tool execution", async () => {
    const onToolStart = async () => {
      throw new Error("telemetry unavailable");
    };
    const onToolEnd = async () => {
      throw new Error("telemetry unavailable");
    };

    await expect(
      executeTool(tool, sumup, { value: "hello" }, { onToolStart, onToolEnd }),
    ).resolves.toEqual({ value: "hello" });
  });
});
