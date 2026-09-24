import {
  createCheckoutParameters as apiCreateParameters,
  createCheckoutResult as apiCreateResult,
  getCheckoutResult as apiGetResult,
  listCheckoutsResult as apiListResult,
} from "../generated/checkouts";

export * from "../generated/checkouts";

// Checkout creation is a payment-link workflow; payment details stay on SumUp.
export const createCheckoutParameters = apiCreateParameters
  .pick({
    merchant_code: true,
    checkout_reference: true,
    amount: true,
    currency: true,
    description: true,
    valid_until: true,
  })
  .strict();

const checkoutFields = {
  id: true,
  checkout_reference: true,
  merchant_code: true,
  amount: true,
  currency: true,
  description: true,
  status: true,
  date: true,
  valid_until: true,
  hosted_checkout_url: true,
  transactions: true,
} as const;

export const createCheckoutResult = apiCreateResult
  .pick(checkoutFields)
  .strip();
export const getCheckoutResult = apiGetResult.pick(checkoutFields).strip();
export const listCheckoutsResult = apiListResult.element
  .pick(checkoutFields)
  .strip()
  .array();
