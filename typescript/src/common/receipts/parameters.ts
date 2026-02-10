import { z } from "zod";

export const getReceiptParameters = z.object({
  id: z
    .string()
    .describe(
      `SumUp unique transaction ID or transaction code, e.g. TS7HDYLSKD.`,
    ),
  mid: z.string().describe(`Merchant code.`),
  tx_event_id: z
    .number()
    .int()
    .optional()
    .describe(`The ID of the transaction event (refund).`),
});

export const getReceiptResult = z
  .object({
    transaction_data: z
      .object({
        transaction_code: z.string().describe(`Transaction code.`).optional(),
        amount: z.string().describe(`Transaction amount.`).optional(),
        vat_amount: z.string().describe(`Transaction VAT amount.`).optional(),
        tip_amount: z
          .string()
          .describe(`Tip amount (included in transaction amount).`)
          .optional(),
        currency: z.string().describe(`Transaction currency.`).optional(),
        timestamp: z.string().describe(`Time created at.`).optional(),
        status: z
          .string()
          .describe(`Transaction processing status.`)
          .optional(),
        payment_type: z.string().describe(`Transaction type.`).optional(),
        entry_mode: z.string().describe(`Transaction entry mode.`).optional(),
        verification_method: z
          .string()
          .describe(`Cardholder verification method.`)
          .optional(),
        card: z
          .object({
            last_4_digits: z
              .string()
              .describe(`Card last 4 digits.`)
              .optional(),
            type: z.string().describe(`Card Scheme.`).optional(),
          })
          .optional(),
        installments_count: z
          .number()
          .int()
          .describe(`Number of installments.`)
          .optional(),
        products: z
          .array(
            z.object({
              name: z.string().describe(`Product name`).optional(),
              price: z.string().describe(`Product price`).optional(),
              vat_rate: z.string().describe(`VAT rate`).optional(),
              single_vat_amount: z
                .string()
                .describe(`VAT amount for a single product`)
                .optional(),
              price_with_vat: z
                .string()
                .describe(`Product price including VAT`)
                .optional(),
              vat_amount: z.string().describe(`VAT amount`).optional(),
              quantity: z
                .number()
                .int()
                .describe(`Product quantity`)
                .optional(),
              total_price: z
                .string()
                .describe(`Quantity x product price`)
                .optional(),
              total_with_vat: z
                .string()
                .describe(`Total price including VAT`)
                .optional(),
            }),
          )
          .describe(`Products`)
          .optional(),
        vat_rates: z
          .array(
            z.object({
              gross: z.number().describe(`Gross`).optional(),
              net: z.number().describe(`Net`).optional(),
              rate: z.number().describe(`Rate`).optional(),
              vat: z.number().describe(`Vat`).optional(),
            }),
          )
          .describe(`Vat rates.`)
          .optional(),
        events: z
          .array(
            z.object({
              id: z
                .number()
                .int()
                .describe(`Unique ID of the transaction event.`)
                .optional(),
              transaction_id: z
                .string()
                .describe(`Unique ID of the transaction.`)
                .optional(),
              type: z
                .enum(["PAYOUT", "CHARGE_BACK", "REFUND", "PAYOUT_DEDUCTION"])
                .describe(`Type of the transaction event.`)
                .optional(),
              status: z
                .enum([
                  "PENDING",
                  "SCHEDULED",
                  "FAILED",
                  "REFUNDED",
                  "SUCCESSFUL",
                  "PAID_OUT",
                ])
                .describe(`Status of the transaction event.`)
                .optional(),
              amount: z.string().describe(`Amount of the event.`).optional(),
              timestamp: z
                .string()
                .describe(`Date and time of the transaction event.`)
                .optional(),
              receipt_no: z.string().optional(),
            }),
          )
          .describe(`Events`)
          .optional(),
        receipt_no: z.string().describe(`Receipt number`).optional(),
      })
      .describe(`Transaction information.`)
      .optional(),
    merchant_data: z
      .object({
        merchant_profile: z
          .object({
            merchant_code: z.string().optional(),
            business_name: z.string().optional(),
            email: z.string().optional(),
            address: z
              .object({
                address_line1: z.string().optional(),
                city: z.string().optional(),
                country: z.string().optional(),
                country_en_name: z.string().optional(),
                country_native_name: z.string().optional(),
                post_code: z.string().optional(),
                landline: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
        locale: z.string().optional(),
      })
      .describe(`Receipt merchant data`)
      .optional(),
    emv_data: z.object({}).optional(),
    acquirer_data: z
      .object({
        tid: z.string().optional(),
        authorization_code: z.string().optional(),
        return_code: z.string().optional(),
        local_time: z.string().optional(),
      })
      .optional(),
  })
  .passthrough()
  .describe(`OK`);
