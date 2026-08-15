import { tool } from "@openai/agents";
import SumUp from "@sumup/sdk";
import { registerTools } from "../common";
import type { ApprovalPolicy } from "../common/types";

type AgentFunctionTool = ReturnType<typeof tool>;

class SumUpAgentToolkit {
  private _sumup: SumUp;

  tools: AgentFunctionTool[];

  constructor({
    apiKey,
    host,
    approvalPolicy,
  }: {
    apiKey: string;
    host?: string;
    approvalPolicy?: ApprovalPolicy;
  }) {
    this._sumup = new SumUp({
      apiKey,
      host,
    });

    this.tools = [];
    registerTools((t) => {
      this.tools.push(
        tool({
          name: t.name,
          description: t.description,
          strict: true,
          parameters: t.parameters,
          needsApproval: approvalPolicy
            ? async (_runContext, input) => await approvalPolicy(t, input)
            : !!t.annotations?.requiresApproval,
          execute: async (input) => {
            const res = await t.callback(this._sumup, input);
            return t.result.parse(res);
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
