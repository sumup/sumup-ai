import SumUp from "@sumup/sdk";

import { type ToolSet, tool, zodSchema } from "ai";
import type z from "zod";
import { registerTools } from "../common";
import type { ApprovalPolicy } from "../common/types";

class SumUpAgentToolkit {
  private _sumup: SumUp;

  tools: ToolSet;

  constructor({
    apiKey,
    host,
    approvalPolicy,
  }: {
    apiKey: string;
    host?: string;
    approvalPolicy?: ApprovalPolicy;
  }) {
    this._sumup = new SumUp({ apiKey, host });
    this.tools = {};

    registerTools((t) => {
      this.tools[t.name] = tool<
        z.infer<typeof t.parameters>,
        z.infer<typeof t.result>,
        Record<string, never>
      >({
        title: t.title,
        description: t.description,
        inputSchema: zodSchema(t.parameters),
        outputSchema: zodSchema(t.result),
        needsApproval: approvalPolicy
          ? (input) => approvalPolicy(t, input)
          : !!t.annotations?.requiresApproval,
        execute: async (input: z.infer<typeof t.parameters>) => {
          const res = await t.callback(this._sumup, input);
          return t.result.parse(res);
        },
      });
    });
  }

  getTools(): ToolSet {
    return this.tools;
  }
}

export default SumUpAgentToolkit;
