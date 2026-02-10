import SumUp from "@sumup/sdk";

import { type ToolSet, tool, zodSchema } from "ai";
import type z from "zod";
import { registerTools } from "../common";

class SumUpAgentToolkit {
  private _sumup: SumUp;

  tools: ToolSet;

  constructor({
    apiKey,
    host,
  }: {
    apiKey: string;
    host?: string;
  }) {
    this._sumup = new SumUp({ apiKey, host });
    this.tools = {};

    registerTools((t) => {
      this.tools[t.name] = tool<
        z.infer<typeof t.parameters>,
        z.infer<typeof t.result>
      >({
        name: t.name,
        description: t.description,
        inputSchema: zodSchema(t.parameters),
        outputSchema: zodSchema(t.result),
        execute: async (input: z.infer<typeof t.parameters>) => {
          const res = await t.callback(this._sumup, input);
          return JSON.stringify(res);
        },
      });
    });
  }

  getTools(): ToolSet {
    return this.tools;
  }
}

export default SumUpAgentToolkit;
