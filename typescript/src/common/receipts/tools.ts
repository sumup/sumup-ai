import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import { getReceiptParameters, getReceiptResult } from "./parameters";

export const getReceipt: Tool<
  typeof getReceiptParameters,
  typeof getReceiptResult
> = {
  name: "get_receipt",
  title: `Retrieve receipt details`,
  description: `Retrieves structured receipt data for a transaction belonging to the merchant specified by \`mid\`. The path accepts either the SumUp transaction ID or transaction code. Provide \`tx_event_id\` to include a specific transaction event, such as a refund, on the receipt.`,
  parameters: getReceiptParameters,
  result: getReceiptResult,
  callback: async (sumup: SumUp, { transactionId, ...args }) => {
    return await sumup.receipts.get(transactionId, args);
  },
  annotations: {
    title: `Retrieve receipt details`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["receipts.read", "transactions.history"],
  },
};
