import type SumUp from "@sumup/sdk";
import {
  createMerchantRoleParameters,
  createMerchantRoleResult,
  deleteMerchantRoleParameters,
  deleteMerchantRoleResult,
  getMerchantRoleParameters,
  getMerchantRoleResult,
  listMerchantRolesParameters,
  listMerchantRolesResult,
  updateMerchantRoleParameters,
  updateMerchantRoleResult,
} from "../generated/roles";
import type { Tool } from "../types";

export const createMerchantRole: Tool<
  typeof createMerchantRoleParameters,
  typeof createMerchantRoleResult,
  "create_merchant_role"
> = {
  name: "create_merchant_role",
  title: `Create a role`,
  description: `Create a custom role for the merchant. Roles are defined by the set of permissions that they grant to the members that they are assigned to.`,
  parameters: createMerchantRoleParameters,
  result: createMerchantRoleResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.roles.create(merchantCode, args);
  },
  annotations: {
    title: `Create a role`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["roles.write", "user.subaccounts"],
  },
};

export const deleteMerchantRole: Tool<
  typeof deleteMerchantRoleParameters,
  typeof deleteMerchantRoleResult,
  "delete_merchant_role"
> = {
  name: "delete_merchant_role",
  title: `Delete a role`,
  description: `Delete a custom role.`,
  parameters: deleteMerchantRoleParameters,
  result: deleteMerchantRoleResult,
  callback: async (sumup: SumUp, { merchantCode, roleId, ...args }) => {
    return await sumup.roles.delete(merchantCode, roleId, args);
  },
  annotations: {
    title: `Delete a role`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["roles.write", "user.subaccounts"],
  },
};

export const getMerchantRole: Tool<
  typeof getMerchantRoleParameters,
  typeof getMerchantRoleResult,
  "get_merchant_role"
> = {
  name: "get_merchant_role",
  title: `Retrieve a role`,
  description: `Retrieve a custom role by ID.`,
  parameters: getMerchantRoleParameters,
  result: getMerchantRoleResult,
  callback: async (sumup: SumUp, { merchantCode, roleId, ...args }) => {
    return await sumup.roles.get(merchantCode, roleId, args);
  },
  annotations: {
    title: `Retrieve a role`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["roles.read", "user.subaccounts"],
  },
};

export const listMerchantRoles: Tool<
  typeof listMerchantRolesParameters,
  typeof listMerchantRolesResult,
  "list_merchant_roles"
> = {
  name: "list_merchant_roles",
  title: `List roles`,
  description: `List merchant's custom roles.`,
  parameters: listMerchantRolesParameters,
  result: listMerchantRolesResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.roles.list(merchantCode, args);
  },
  annotations: {
    title: `List roles`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["roles.read", "user.subaccounts"],
  },
};

export const updateMerchantRole: Tool<
  typeof updateMerchantRoleParameters,
  typeof updateMerchantRoleResult,
  "update_merchant_role"
> = {
  name: "update_merchant_role",
  title: `Update a role`,
  description: `Updates a custom role's name, description, or permissions and returns the updated role.

Providing \`permissions\` replaces the role's permission list and changes the access granted to members assigned to that role. Omitted fields remain unchanged.`,
  parameters: updateMerchantRoleParameters,
  result: updateMerchantRoleResult,
  callback: async (sumup: SumUp, { merchantCode, roleId, ...args }) => {
    return await sumup.roles.update(merchantCode, roleId, args);
  },
  annotations: {
    title: `Update a role`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["roles.write", "user.subaccounts"],
  },
};
