import { createToolFilter } from "./filter";
import type { Tool } from "./types";

const tools = [
  { name: "get_checkout", annotations: { readOnly: true } },
  { name: "create_checkout", annotations: { readOnly: false } },
  { name: "unknown" },
] as Tool[];

test("an empty allowlist exposes no tools", () => {
  expect(tools.filter(createToolFilter({ includeTools: [] }))).toEqual([]);
});

test("exclusions take precedence over the allowlist", () => {
  const filter = createToolFilter({
    includeTools: ["get_checkout", "create_checkout"] as const,
    excludeTools: ["create_checkout"],
  });
  expect(tools.filter(filter).map((tool) => tool.name)).toEqual([
    "get_checkout",
  ]);
});

test("read-only mode excludes writes and tools without annotations", () => {
  expect(
    tools.filter(createToolFilter({ readOnly: true })).map((tool) => tool.name),
  ).toEqual(["get_checkout"]);
});
