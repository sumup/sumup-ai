import type SumUp from "@sumup/sdk";
import {
  createMerchantMemberParameters,
  createMerchantMemberResult,
  deleteMerchantMemberParameters,
  deleteMerchantMemberResult,
  getMerchantMemberParameters,
  getMerchantMemberResult,
  listMerchantMembersParameters,
  listMerchantMembersResult,
  updateMerchantMemberParameters,
  updateMerchantMemberResult,
} from "../generated/members";
import type { Tool } from "../types";

export const createMerchantMember: Tool<
  typeof createMerchantMemberParameters,
  typeof createMerchantMemberResult,
  "create_merchant_member"
> = {
  name: "create_merchant_member",
  title: `Create a member`,
  description: `Adds a member to the merchant account with the specified roles.

By default, sends an invitation email to the provided address. The recipient must accept the invitation to join the account.
When \`is_managed_user\` is \`true\`, creates a managed user with the provided password and optional nickname and assigns the roles directly, without sending an invitation.`,
  parameters: createMerchantMemberParameters,
  result: createMerchantMemberResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.members.create(merchantCode, args);
  },
  annotations: {
    title: `Create a member`,
    readOnly: false,
    openWorld: true,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["members.write", "user.subaccounts"],
  },
};

export const deleteMerchantMember: Tool<
  typeof deleteMerchantMemberParameters,
  typeof deleteMerchantMemberResult,
  "delete_merchant_member"
> = {
  name: "delete_merchant_member",
  title: `Delete a member`,
  description: `Deletes a merchant member.`,
  parameters: deleteMerchantMemberParameters,
  result: deleteMerchantMemberResult,
  callback: async (sumup: SumUp, { merchantCode, memberId, ...args }) => {
    return await sumup.members.delete(merchantCode, memberId, args);
  },
  annotations: {
    title: `Delete a member`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["members.write", "user.subaccounts"],
  },
};

export const getMerchantMember: Tool<
  typeof getMerchantMemberParameters,
  typeof getMerchantMemberResult,
  "get_merchant_member"
> = {
  name: "get_merchant_member",
  title: `Retrieve a member`,
  description: `Retrieve a merchant member.`,
  parameters: getMerchantMemberParameters,
  result: getMerchantMemberResult,
  callback: async (sumup: SumUp, { merchantCode, memberId, ...args }) => {
    return await sumup.members.get(merchantCode, memberId, args);
  },
  annotations: {
    title: `Retrieve a member`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["members.read", "user.subaccounts"],
  },
};

export const listMerchantMembers: Tool<
  typeof listMerchantMembersParameters,
  typeof listMerchantMembersResult,
  "list_merchant_members"
> = {
  name: "list_merchant_members",
  title: `List members`,
  description: `Lists merchant members.`,
  parameters: listMerchantMembersParameters,
  result: listMerchantMembersResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.members.list(merchantCode, args);
  },
  annotations: {
    title: `List members`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["members.read", "user.subaccounts"],
  },
};

export const updateMerchantMember: Tool<
  typeof updateMerchantMemberParameters,
  typeof updateMerchantMemberResult,
  "update_merchant_member"
> = {
  name: "update_merchant_member",
  title: `Update a member`,
  description: `Updates a merchant member and returns the updated member.

Providing \`roles\` replaces the member's assigned roles and can grant or revoke access. Providing \`metadata\` replaces the entire metadata object.
For managed users, \`user.nickname\` changes the display name and \`user.password\` replaces the password. Updating the password also enables the managed user account.`,
  parameters: updateMerchantMemberParameters,
  result: updateMerchantMemberResult,
  callback: async (sumup: SumUp, { merchantCode, memberId, ...args }) => {
    return await sumup.members.update(merchantCode, memberId, args);
  },
  annotations: {
    title: `Update a member`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: true,
    oauthScopes: ["members.write", "user.subaccounts"],
  },
};
