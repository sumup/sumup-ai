import * as checkouts from "./checkouts";
import * as customers from "./customers";
import * as members from "./members";
import * as memberships from "./memberships";
import * as merchants from "./merchants";
import * as payouts from "./payouts";
import * as readers from "./readers";
import * as receipts from "./receipts";
import { registerTools } from "./registry";
import * as roles from "./roles";
import * as transactions from "./transactions";
import type { Tool } from "./types";

const toolExports = [
  checkouts,
  customers,
  members,
  memberships,
  merchants,
  payouts,
  readers,
  receipts,
  roles,
  transactions,
].flatMap(Object.values);

const isTool = (value: unknown): value is Tool =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  "callback" in value;

describe("tool registry", () => {
  test("registers every exported tool", () => {
    const exportedToolNames = toolExports
      .filter(isTool)
      .map((tool) => tool.name)
      .sort();
    const registeredToolNames: string[] = [];
    registerTools((tool) => registeredToolNames.push(tool.name));
    registeredToolNames.sort();

    expect(registeredToolNames).toEqual(exportedToolNames);
  });
});
