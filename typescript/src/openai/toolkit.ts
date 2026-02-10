import { tool } from "@openai/agents";
import SumUp from "@sumup/sdk";
import type z from "zod";
import { registerTools } from "../common";

type AgentFunctionTool = ReturnType<typeof tool>;

class SumUpAgentToolkit {
  private _sumup: SumUp;

  tools: AgentFunctionTool[];

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
        tool<z.infer<typeof t.parameters>>({
          name: t.name,
          description: t.description,
          strict: true,
          parameters: t.parameters,
          needsApproval: !!t.annotations?.destructive,
          execute: async (input: z.infer<typeof t.parameters>) => {
            const res = await t.callback(this._sumup, input);
            return JSON.stringify(res);
          },
        }),
      );
    });
  }

  getTools(): AgentFunctionTool[] {
    return this.tools;
  }
}

export default SumUpAgentToolkit;
