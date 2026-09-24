import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";
import { getReceiptParameters, getReceiptResult } from "./parameters";

export const getReceipt: Tool<
  typeof getReceiptParameters,
  typeof getReceiptResult,
  "get_receipt"
> = {
  name: "get_receipt",
  title: `Retrieve receipt details`,
  description: `Retrieves a receipt summary with transaction details, purchased items, and merchant identity. Omits merchant contact details, tax identifiers, and payment processor data; this summary does not replace the original receipt.`,
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
