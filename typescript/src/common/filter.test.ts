import { createToolFilter } from "./filter";
import type { Tool } from "./types";

const tools = [
  { name: "read", annotations: { readOnly: true } },
  { name: "write", annotations: { readOnly: false } },
  { name: "unknown" },
] as Tool[];

test("an empty allowlist exposes no tools", () => {
  expect(tools.filter(createToolFilter({ includeTools: [] }))).toEqual([]);
});

test("exclusions take precedence over the allowlist", () => {
  const filter = createToolFilter({
    includeTools: ["read", "write"],
    excludeTools: ["write"],
  });
  expect(tools.filter(filter).map((tool) => tool.name)).toEqual(["read"]);
});

test("read-only mode excludes writes and tools without annotations", () => {
  expect(
    tools.filter(createToolFilter({ readOnly: true })).map((tool) => tool.name),
  ).toEqual(["read"]);
});
