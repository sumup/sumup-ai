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
  title: `Retrieve a Merchant`,
  description: `Retrieve a merchant.`,
  parameters: getMerchantParameters,
  result: getMerchantResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.merchants.get(merchantCode, args);
  },
  annotations: {
    title: `Retrieve a Merchant`,
    readOnly: true,
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
  title: `Retrieve a Person`,
  description: `Returns a single person related to the merchant.`,
  parameters: getPersonParameters,
  result: getPersonResult,
  callback: async (sumup: SumUp, { merchantCode, personId, ...args }) => {
    return await sumup.merchants.getPerson(merchantCode, personId, args);
  },
  annotations: {
    title: `Retrieve a Person`,
    readOnly: true,
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
  description: `Returns a list of persons related to the merchant.`,
  parameters: listPersonsParameters,
  result: listPersonsResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.merchants.listPersons(merchantCode, args);
  },
  annotations: {
    title: `List Persons`,
    readOnly: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};
