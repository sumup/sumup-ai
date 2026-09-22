import { tool } from "@openai/agents";
import SumUp from "@sumup/sdk";
import {
  createToolFilter,
  executeTool,
  registerTools,
  type ToolObservability,
  type ToolSelection,
} from "../common";
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
    includeTools,
    excludeTools,
    readOnly,
  }: ToolSelection & {
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
    const includes = createToolFilter({ includeTools, excludeTools, readOnly });
    registerTools((t) => {
      if (!includes(t)) return;
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
