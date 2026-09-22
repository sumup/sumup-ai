import {
  type BaseToolkit,
  type StructuredToolInterface,
  tool,
} from "@langchain/core/tools";
import SumUp from "@sumup/sdk";
import type z from "zod";
import {
  createToolFilter,
  executeTool,
  registerTools,
  type ToolObservability,
  type ToolSelection,
} from "../common";

class SumUpAgentToolkit implements BaseToolkit {
  private _sumup: SumUp;

  tools: StructuredToolInterface[];

  constructor({
    apiKey,
    host,
    observability,
    includeTools,
    excludeTools,
    readOnly,
  }: ToolSelection & {
    apiKey: string;
    host?: string;
    observability?: ToolObservability;
  }) {
    this._sumup = new SumUp({
      apiKey,
      host,
    });

    this.tools = [];
    const includes = createToolFilter({ includeTools, excludeTools, readOnly });
    registerTools((t) => {
      if (!includes(t)) return;
      this.tools.push(
        tool(
          async (
            input: z.infer<typeof t.parameters>,
          ): Promise<z.infer<typeof t.result>> => {
            return await executeTool(t, this._sumup, input, observability);
          },
          {
            name: t.name,
            description: t.description,
            schema: t.parameters,
            metadata: t.annotations?.oauthScopes?.length
              ? {
                  oauthScopes: t.annotations.oauthScopes,
                }
              : undefined,
            responseFormat: "content",
          },
        ),
      );
    });
  }

  getTools(): StructuredToolInterface[] {
    return this.tools;
  }
}

export default SumUpAgentToolkit;
