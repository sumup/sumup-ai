import { tool } from "@openai/agents";
import SumUp from "@sumup/sdk";
import { executeTool, registerTools, type ToolObservability } from "../common";
import type { ApprovalPolicy } from "../common/types";

type AgentFunctionTool = ReturnType<typeof tool>;

class SumUpAgentToolkit {
  private _sumup: SumUp;

  tools: AgentFunctionTool[];

  constructor({
    apiKey,
    host,
    approvalPolicy,
    observability,
  }: {
    apiKey: string;
    host?: string;
    approvalPolicy?: ApprovalPolicy;
    observability?: ToolObservability;
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
            return await executeTool(t, this._sumup, input, observability);
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
