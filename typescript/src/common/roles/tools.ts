import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

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
} from "./parameters";

export const createMerchantRole: Tool<
  typeof createMerchantRoleParameters,
  typeof createMerchantRoleResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};

export const deleteMerchantRole: Tool<
  typeof deleteMerchantRoleParameters,
  typeof deleteMerchantRoleResult
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
    destructive: true,
    idempotent: false,
    oauthScopes: [],
  },
};

export const getMerchantRole: Tool<
  typeof getMerchantRoleParameters,
  typeof getMerchantRoleResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};

export const listMerchantRoles: Tool<
  typeof listMerchantRolesParameters,
  typeof listMerchantRolesResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};

export const updateMerchantRole: Tool<
  typeof updateMerchantRoleParameters,
  typeof updateMerchantRoleResult
> = {
  name: "update_merchant_role",
  title: `Update a role`,
  description: `Update a custom role.`,
  parameters: updateMerchantRoleParameters,
  result: updateMerchantRoleResult,
  callback: async (sumup: SumUp, { merchantCode, roleId, ...args }) => {
    return await sumup.roles.update(merchantCode, roleId, args);
  },
  annotations: {
    title: `Update a role`,
    readOnly: false,
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};
