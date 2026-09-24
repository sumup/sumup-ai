import { getReceiptResult as apiReceipt } from "../generated/receipts";

export * from "../generated/receipts";

const merchant = apiReceipt.shape.merchant_data.unwrap();
export const getReceiptResult = apiReceipt
  .pick({ transaction_data: true })
  .strip()
  .extend({
    merchant_data: merchant
      .pick({ locale: true })
      .strip()
      .extend({
        merchant_profile: merchant.shape.merchant_profile
          .unwrap()
          .pick({
            merchant_code: true,
            business_name: true,
          })
          .strip()
          .optional(),
      })
      .optional(),
  });
