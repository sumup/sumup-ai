import { z } from "zod";

export const listPayoutsV1Parameters = z.object({
  merchantCode: z.string(),
  start_date: z
    .string()
    .describe(
      `Start date (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format).`,
    ),
  end_date: z
    .string()
    .describe(
      `End date (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format).`,
    ),
  format: z.enum(["json", "csv"]).optional(),
  limit: z.number().int().optional(),
  order: z.enum(["desc", "asc"]).optional(),
});

export const listPayoutsV1Result = z
  .array(
    z.object({
      amount: z.number().optional(),
      currency: z.string().optional(),
      date: z.string().optional(),
      fee: z.number().optional(),
      id: z.number().int().optional(),
      reference: z.string().optional(),
      status: z.enum(["SUCCESSFUL", "FAILED"]).optional(),
      transaction_code: z.string().optional(),
      type: z
        .enum([
          "PAYOUT",
          "CHARGE_BACK_DEDUCTION",
          "REFUND_DEDUCTION",
          "DD_RETURN_DEDUCTION",
          "BALANCE_DEDUCTION",
        ])
        .optional(),
    }),
  )
  .describe(`List of payout summaries.`);
