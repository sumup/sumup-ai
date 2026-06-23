import { z } from "zod";

export const listPayoutsV1Parameters = z.object({
  merchantCode: z
    .string()
    .describe(`Merchant code of the account whose payouts should be listed.`),
  start_date: z
    .string()
    .describe(
      `Start date of the payout period filter, inclusive, in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) \`date\` format (\`YYYY-MM-DD\`).`,
    ),
  end_date: z
    .string()
    .describe(
      `End date of the payout period filter, inclusive, in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) \`date\` format (\`YYYY-MM-DD\`). Must be greater than or equal to \`start_date\`.`,
    ),
  format: z
    .enum(["json", "csv"])
    .optional()
    .describe(`Response format for the payout list.`),
  limit: z
    .number()
    .int()
    .optional()
    .describe(`Maximum number of payout records to return.`),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe(`Sort direction for the returned payouts.`),
});

export const listPayoutsV1Result = z
  .array(
    z
      .object({
        id: z
          .number()
          .int()
          .describe(`Unique identifier of the payout-related record.`),
        type: z
          .enum([
            "PAYOUT",
            "CHARGE_BACK_DEDUCTION",
            "REFUND_DEDUCTION",
            "DD_RETURN_DEDUCTION",
            "BALANCE_DEDUCTION",
          ])
          .describe(`High-level payout record category.`),
        amount: z
          .number()
          .describe(`Amount of the payout or deduction in major units.`),
        date: z
          .string()
          .describe(
            `Payout date associated with the record, in \`YYYY-MM-DD\` format.`,
          ),
        currency: z
          .string()
          .describe(`Three-letter ISO 4217 currency code of the payout.`),
        fee: z
          .number()
          .describe(
            `Fee amount associated with the payout record, in major units.`,
          ),
        status: z
          .enum(["SUCCESSFUL", "FAILED"])
          .describe(`Merchant-facing outcome of the payout record.`),
        reference: z
          .string()
          .describe(
            `Processor or payout reference associated with the record.`,
          ),
        transaction_code: z
          .string()
          .describe(
            `Transaction code of the original sale associated with the payout or deduction.`,
          ),
      })
      .describe(`A single payout-related record.

A record can represent either:
- an actual payout sent to the merchant (\`type = PAYOUT\`)
- a deduction applied against merchant funds for a refund, chargeback, direct debit return, or balance adjustment`),
  )
  .describe(`Ordered list of payout and payout-deduction records.`);
