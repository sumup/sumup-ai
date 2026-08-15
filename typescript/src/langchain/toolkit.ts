import {
  type BaseToolkit,
  type StructuredToolInterface,
  tool,
} from "@langchain/core/tools";
import SumUp from "@sumup/sdk";
import type z from "zod";
import { executeTool, registerTools, type ToolObservability } from "../common";

class SumUpAgentToolkit implements BaseToolkit {
  private _sumup: SumUp;

  tools: StructuredToolInterface[];

  constructor({
    apiKey,
    host,
    observability,
  }: {
    apiKey: string;
    host?: string;
    observability?: ToolObservability;
  }) {
    this._sumup = new SumUp({
      apiKey,
      host,
    });

    this.tools = [];
    registerTools((t) => {
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
