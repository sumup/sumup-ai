import type { Tool } from "./types";

export type ToolSelection = {
  includeTools?: string[];
  excludeTools?: string[];
  readOnly?: boolean;
};

export function createToolFilter({
  includeTools,
  excludeTools = [],
  readOnly = false,
}: ToolSelection) {
  const included = includeTools ? new Set(includeTools) : undefined;
  const excluded = new Set(excludeTools);
  return (tool: Tool) =>
    (!included || included.has(tool.name)) &&
    !excluded.has(tool.name) &&
    (!readOnly || tool.annotations?.readOnly === true);
}
