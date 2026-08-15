import type SumUp from "@sumup/sdk";
import type { z } from "zod";
import type { Tool } from "./types";

export type ToolExecutionStarted = {
  toolName: string;
  startedAt: number;
};

export type ToolExecutionCompleted = ToolExecutionStarted & {
  durationMs: number;
};

export type ToolExecutionFailed = ToolExecutionCompleted & {
  error: unknown;
};

export type ToolObservability = {
  onToolStart?: (event: ToolExecutionStarted) => void | Promise<void>;
  onToolEnd?: (event: ToolExecutionCompleted) => void | Promise<void>;
  onToolError?: (event: ToolExecutionFailed) => void | Promise<void>;
};

const notify = async <Event>(
  callback: ((event: Event) => void | Promise<void>) | undefined,
  event: Event,
) => {
  try {
    await callback?.(event);
  } catch {
    // Observability must never change tool execution behavior.
  }
};

export const executeTool = async <
  Args extends z.ZodObject<z.ZodRawShape>,
  Result extends z.ZodTypeAny,
>(
  tool: Tool<Args, Result>,
  sumup: SumUp,
  input: z.infer<Args>,
  observability?: ToolObservability,
): Promise<z.infer<Result>> => {
  const startedAt = Date.now();
  const started = { toolName: tool.name, startedAt };
  await notify(observability?.onToolStart, started);

  try {
    const result = tool.result.parse(await tool.callback(sumup, input));
    await notify(observability?.onToolEnd, {
      ...started,
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    await notify(observability?.onToolError, {
      ...started,
      durationMs: Date.now() - startedAt,
      error,
    });
    throw error;
  }
};
