import type { Tool } from "./types";

/** Selects tools before registration; it does not replace API authorization. */
export type ToolSelection = {
  /** Exact tool names to expose. Omit for all tools; an empty array selects none. */
  includeTools?: string[];
  /** Exact tool names to omit, including names present in includeTools. */
  excludeTools?: string[];
  /** Include only tools explicitly annotated readOnly: true. Defaults to false. */
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
