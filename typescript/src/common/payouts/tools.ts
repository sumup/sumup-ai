import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import { listPayoutsV1Parameters, listPayoutsV1Result } from "./parameters";

export const listPayoutsV1: Tool<
  typeof listPayoutsV1Parameters,
  typeof listPayoutsV1Result
> = {
  name: "list_payouts_v1",
  title: `List payouts`,
  description: `Lists payout and payout-deduction records for the specified merchant account within the requested date range.

The response can include:
- regular payouts (\`type = PAYOUT\`)
- deduction records for refunds, chargebacks, direct debit returns, or balance adjustments

Results are sorted by payout date in the requested \`order\`.`,
  parameters: listPayoutsV1Parameters,
  result: listPayoutsV1Result,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.payouts.list(merchantCode, args);
  },
  annotations: {
    title: `List payouts`,
    readOnly: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["user.profile", "user.profile_readonly"],
  },
};
