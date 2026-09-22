import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import {
  createApplePaySessionParameters,
  createApplePaySessionResult,
  createCheckoutParameters,
  createCheckoutResult,
  deactivateCheckoutParameters,
  deactivateCheckoutResult,
  getCheckoutParameters,
  getCheckoutResult,
  getPaymentMethodsParameters,
  getPaymentMethodsResult,
  listCheckoutsParameters,
  listCheckoutsResult,
  updateCheckoutParameters,
  updateCheckoutResult,
} from "./parameters";

export const createApplePaySession: Tool<
  typeof createApplePaySessionParameters,
  typeof createApplePaySessionResult
> = {
  name: "create_apple_pay_session",
  title: `Create an Apple Pay session`,
  description: `Creates an Apple Pay merchant session for the specified checkout.

Use this endpoint after the customer selects Apple Pay and before calling
\`ApplePaySession.completeMerchantValidation(...)\` in the browser.
SumUp validates the merchant session request and returns the Apple Pay
session object that your frontend should pass to Apple's JavaScript API.`,
  parameters: createApplePaySessionParameters,
  result: createApplePaySessionResult,
  callback: async (sumup: SumUp, { checkoutId, ...args }) => {
    return await sumup.checkouts.createApplePaySession(checkoutId, args);
  },
  annotations: {
    title: `Create an Apple Pay session`,
    readOnly: false,
    openWorld: true,
    requiresApproval: true,
    destructive: false,
    idempotent: true,
    oauthScopes: [],
  },
};

export const createCheckout: Tool<
  typeof createCheckoutParameters,
  typeof createCheckoutResult
> = {
  name: "create_checkout",
  title: `Create a checkout`,
  description: `Creates a payment checkout for the specified merchant, amount, and currency. Supply a \`checkout_reference\` to identify the payment attempt in your own systems. Creating a checkout does not charge a payment instrument.

Set \`hosted_checkout.enabled\` to \`true\` to receive a [Hosted Checkout](https://developer.sumup.com/online-payments/checkouts/hosted-checkout/) URL where the customer can complete the payment.
Use \`redirect_url\` for redirect-based payment and 3DS flows. If \`return_url\` is provided, SumUp sends processing updates to that backend callback URL.

Complete the payment through Hosted Checkout, the Payment Widget, or the process-checkout endpoint.`,
  parameters: createCheckoutParameters,
  result: createCheckoutResult,
  callback: async (sumup: SumUp, args) => {
    return await sumup.checkouts.create(args);
  },
  annotations: {
    title: `Create a checkout`,
    readOnly: false,
    openWorld: true,
    requiresApproval: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["checkouts.write", "payments"],
  },
};

export const deactivateCheckout: Tool<
  typeof deactivateCheckoutParameters,
  typeof deactivateCheckoutResult
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
  typeof getCheckoutResult
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

export const getPaymentMethods: Tool<
  typeof getPaymentMethodsParameters,
  typeof getPaymentMethodsResult
> = {
  name: "get_payment_methods",
  title: `Get available payment methods`,
  description: `Get payment methods available for the given merchant to use with a checkout.`,
  parameters: getPaymentMethodsParameters,
  result: getPaymentMethodsResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.checkouts.listAvailablePaymentMethods(
      merchantCode,
      args,
    );
  },
  annotations: {
    title: `Get available payment methods`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};

export const listCheckouts: Tool<
  typeof listCheckoutsParameters,
  typeof listCheckoutsResult
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
  typeof updateCheckoutResult
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
