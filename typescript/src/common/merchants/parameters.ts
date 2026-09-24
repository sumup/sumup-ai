import { getMerchantResult as apiMerchant } from "../generated/merchants";

export * from "../generated/merchants";

export const getMerchantResult = apiMerchant
  .pick({
    merchant_code: true,
    country: true,
    default_currency: true,
    default_locale: true,
    sandbox: true,
  })
  .strip()
  .extend({
    company: apiMerchant.shape.company
      .unwrap()
      .pick({ name: true })
      .strip()
      .optional(),
    business_profile: apiMerchant.shape.business_profile
      .unwrap()
      .pick({ name: true })
      .strip()
      .optional(),
  });
