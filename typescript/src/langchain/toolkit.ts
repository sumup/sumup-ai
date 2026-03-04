import {
  type BaseToolkit,
  type StructuredTool,
  tool,
} from "@langchain/core/tools";
import SumUp from "@sumup/sdk";
import type z from "zod";
import { registerTools } from "../common";

class SumUpAgentToolkit implements BaseToolkit {
  private _sumup: SumUp;

  tools: StructuredTool[];

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
            responseFormat: "content",
          },
        ),
      );
    });
  }

  getTools(): StructuredTool[] {
    return this.tools;
  }
}

export default SumUpAgentToolkit;
