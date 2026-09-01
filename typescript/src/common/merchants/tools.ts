import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import {
  getMerchantParameters,
  getMerchantResult,
  getPersonParameters,
  getPersonResult,
  listPersonsParameters,
  listPersonsResult,
} from "./parameters";

export const getMerchant: Tool<
  typeof getMerchantParameters,
  typeof getMerchantResult
> = {
  name: "get_merchant",
  title: `Get Merchant`,
  description: `Returns a Merchant for a valid Merchant code.`,
  parameters: getMerchantParameters,
  result: getMerchantResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.merchants.get(merchantCode, args);
  },
  annotations: {
    title: `Get Merchant`,
    readOnly: true,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};

export const getPerson: Tool<
  typeof getPersonParameters,
  typeof getPersonResult
> = {
  name: "get_person",
  title: `Get Person`,
  description: `Returns a single Person related to a Merchant.`,
  parameters: getPersonParameters,
  result: getPersonResult,
  callback: async (sumup: SumUp, { merchantCode, personId, ...args }) => {
    return await sumup.merchants.getPerson(merchantCode, personId, args);
  },
  annotations: {
    title: `Get Person`,
    readOnly: true,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};

export const listPersons: Tool<
  typeof listPersonsParameters,
  typeof listPersonsResult
> = {
  name: "list_persons",
  title: `List Persons`,
  description: `Returns the Persons related to a Merchant.`,
  parameters: listPersonsParameters,
  result: listPersonsResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.merchants.listPersons(merchantCode, args);
  },
  annotations: {
    title: `List Persons`,
    readOnly: true,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};
