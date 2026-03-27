import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import { getReceiptParameters, getReceiptResult } from "./parameters";

export const getReceipt: Tool<
  typeof getReceiptParameters,
  typeof getReceiptResult
> = {
  name: "get_receipt",
  title: `Retrieve receipt details`,
  description: `Retrieves receipt specific data for a transaction.`,
  parameters: getReceiptParameters,
  result: getReceiptResult,
  callback: async (sumup: SumUp, { id, ...args }) => {
    return await sumup.receipts.get(id, args);
  },
  annotations: {
    title: `Retrieve receipt details`,
    readOnly: true,
    destructive: false,
    idempotent: false,
    oauthScopes: [],
  },
};
