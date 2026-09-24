import type SumUp from "@sumup/sdk";
import {
  createCustomerParameters,
  createCustomerResult,
  getCustomerParameters,
  getCustomerResult,
  listPaymentInstrumentsParameters,
  listPaymentInstrumentsResult,
  updateCustomerParameters,
  updateCustomerResult,
} from "../generated/customers";
import type { Tool } from "../types";

export const createCustomer: Tool<
  typeof createCustomerParameters,
  typeof createCustomerResult,
  "create_customer"
> = {
  name: "create_customer",
  title: `Create a customer`,
  description: `Creates a new saved customer resource which you can later manipulate and save payment instruments to.`,
  parameters: createCustomerParameters,
  result: createCustomerResult,
  callback: async (sumup: SumUp, args) => {
    return await sumup.customers.create(args);
  },
  annotations: {
    title: `Create a customer`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["customers.write", "payment_instruments"],
  },
};

export const getCustomer: Tool<
  typeof getCustomerParameters,
  typeof getCustomerResult,
  "get_customer"
> = {
  name: "get_customer",
  title: `Retrieve a customer`,
  description: `Retrieves an identified saved customer resource through the unique \`customer_id\` parameter, generated upon customer creation.`,
  parameters: getCustomerParameters,
  result: getCustomerResult,
  callback: async (sumup: SumUp, { customerId, ...args }) => {
    return await sumup.customers.get(customerId, args);
  },
  annotations: {
    title: `Retrieve a customer`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["customers.read", "payment_instruments"],
  },
};

export const listPaymentInstruments: Tool<
  typeof listPaymentInstrumentsParameters,
  typeof listPaymentInstrumentsResult,
  "list_payment_instruments"
> = {
  name: "list_payment_instruments",
  title: `List payment instruments`,
  description: `Lists all payment instrument resources that are saved for an identified customer.`,
  parameters: listPaymentInstrumentsParameters,
  result: listPaymentInstrumentsResult,
  callback: async (sumup: SumUp, { customerId, ...args }) => {
    return await sumup.customers.listPaymentInstruments(customerId, args);
  },
  annotations: {
    title: `List payment instruments`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["customers.read", "payment_instruments"],
  },
};

export const updateCustomer: Tool<
  typeof updateCustomerParameters,
  typeof updateCustomerResult,
  "update_customer"
> = {
  name: "update_customer",
  title: `Update a customer`,
  description: `Updates an identified saved customer resource's personal details.

The request only overwrites the parameters included in the request, all other parameters will remain with their initially assigned values.`,
  parameters: updateCustomerParameters,
  result: updateCustomerResult,
  callback: async (sumup: SumUp, { customerId, ...args }) => {
    return await sumup.customers.update(customerId, args);
  },
  annotations: {
    title: `Update a customer`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: true,
    oauthScopes: ["customers.write", "payment_instruments"],
  },
};
