import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";
import {
  createCheckoutParameters,
  createCheckoutResult,
  deactivateCheckoutParameters,
  deactivateCheckoutResult,
  getCheckoutParameters,
  getCheckoutResult,
  listCheckoutsParameters,
  listCheckoutsResult,
  updateCheckoutParameters,
  updateCheckoutResult,
} from "./parameters";

export const createCheckout: Tool<
  typeof createCheckoutParameters,
  typeof createCheckoutResult,
  "create_checkout"
> = {
  name: "create_checkout",
  title: `Create a hosted checkout`,
  description: `Creates a SumUp-hosted payment page for the specified merchant, amount, and currency. Returns the checkout and its payment URL so the customer can complete payment securely. Creating the checkout does not charge the customer.`,
  parameters: createCheckoutParameters,
  result: createCheckoutResult,
  callback: async (sumup: SumUp, args) => {
    return await sumup.checkouts.create({
      ...createCheckoutParameters.parse(args),
      hosted_checkout: { enabled: true },
    });
  },
  annotations: {
    title: `Create a hosted checkout`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["checkouts.write", "payments"],
  },
};

export const deactivateCheckout: Tool<
  typeof deactivateCheckoutParameters,
  typeof deactivateCheckoutResult,
  "deactivate_checkout"
> = {
  name: "deactivate_checkout",
  title: `Deactivate a checkout`,
  description: `Deactivates an identified checkout resource. If the checkout has already been processed it can not be deactivated.`,
  parameters: deactivateCheckoutParameters,
  result: deactivateCheckoutResult,
  callback: async (sumup: SumUp, { checkoutId, ...args }) => {
    return await sumup.checkouts.deactivate(checkoutId, args);
  },
  annotations: {
    title: `Deactivate a checkout`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["checkouts.write", "payments"],
  },
};

export const getCheckout: Tool<
  typeof getCheckoutParameters,
  typeof getCheckoutResult,
  "get_checkout"
> = {
  name: "get_checkout",
  title: `Retrieve a checkout`,
  description: `Retrieves an identified checkout resource. Use this request after processing a checkout to confirm its status and inform the end user respectively.`,
  parameters: getCheckoutParameters,
  result: getCheckoutResult,
  callback: async (sumup: SumUp, { checkoutId, ...args }) => {
    return await sumup.checkouts.get(checkoutId, args);
  },
  annotations: {
    title: `Retrieve a checkout`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["checkouts.read", "payments"],
  },
};

export const listCheckouts: Tool<
  typeof listCheckoutsParameters,
  typeof listCheckoutsResult,
  "list_checkouts"
> = {
  name: "list_checkouts",
  title: `List checkouts`,
  description: `Lists created checkout resources according to the applied \`checkout_reference\`.`,
  parameters: listCheckoutsParameters,
  result: listCheckoutsResult,
  callback: async (sumup: SumUp, args) => {
    return await sumup.checkouts.list(args);
  },
  annotations: {
    title: `List checkouts`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["checkouts.read", "payments"],
  },
};

export const updateCheckout: Tool<
  typeof updateCheckoutParameters,
  typeof updateCheckoutResult,
  "update_checkout"
> = {
  name: "update_checkout",
  title: `Update a checkout`,
  description: `Updates the amount, currency, description, reference, expiration, or customer associated with an existing checkout. Only the supplied fields are updated.

This request changes the checkout details; it does not charge a payment instrument. Process the checkout separately to attempt a payment.`,
  parameters: updateCheckoutParameters,
  result: updateCheckoutResult,
  callback: async (sumup: SumUp, { checkoutId, ...args }) => {
    return await sumup.checkouts.update(checkoutId, args);
  },
  annotations: {
    title: `Update a checkout`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["checkouts.write", "payments"],
  },
};
