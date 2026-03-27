import {
  type BaseToolkit,
  type StructuredToolInterface,
  tool,
} from "@langchain/core/tools";
import SumUp from "@sumup/sdk";
import type z from "zod";
import { registerTools } from "../common";

class SumUpAgentToolkit implements BaseToolkit {
  private _sumup: SumUp;

  tools: StructuredToolInterface[];

  constructor({
    apiKey,
    host,
  }: {
    apiKey: string;
    host?: string;
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
            return await t.callback(this._sumup, input);
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
