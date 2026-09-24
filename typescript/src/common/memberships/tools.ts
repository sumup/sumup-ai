import type SumUp from "@sumup/sdk";
import {
  listMembershipsParameters,
  listMembershipsResult,
} from "../generated/memberships";
import type { Tool } from "../types";

export const listMemberships: Tool<
  typeof listMembershipsParameters,
  typeof listMembershipsResult,
  "list_memberships"
> = {
  name: "list_memberships",
  title: `List memberships`,
  description: `List memberships of the current user.`,
  parameters: listMembershipsParameters,
  result: listMembershipsResult,
  callback: async (sumup: SumUp, args) => {
    return await sumup.memberships.list(args);
  },
  annotations: {
    title: `List memberships`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};
