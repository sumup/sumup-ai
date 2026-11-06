import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import {
  getTransactionV2_1Parameters,
  getTransactionV2_1Result,
  listTransactionsV2_1Parameters,
  listTransactionsV2_1Result,
  refundTransactionParameters,
  refundTransactionResult,
} from "./parameters";

export const getTransactionV2_1: Tool<
  typeof getTransactionV2_1Parameters,
  typeof getTransactionV2_1Result
> = {
  name: "get_transaction_v2_1",
  title: `Retrieve a transaction`,
  description: `Retrieves the full details of an identified transaction. The transaction resource is identified by a query parameter and *one* of following parameters is required:
- \`id\`
- \`transaction_code\`
- \`foreign_transaction_id\`
- \`client_transaction_id\``,
  parameters: getTransactionV2_1Parameters,
  result: getTransactionV2_1Result,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.transactions.get(merchantCode, args);
  },
  annotations: {
    title: `Retrieve a transaction`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["transactions.history", "transactions.read"],
  },
};

export const listTransactionsV2_1: Tool<
  typeof listTransactionsV2_1Parameters,
  typeof listTransactionsV2_1Result
> = {
  name: "list_transactions_v2_1",
  title: `List transactions`,
  description: `Lists transaction history for the merchant, with optional filters for payment type, status, and date range. The response contains the current page in \`items\` and pagination query strings in \`links\`.

To request another page, use the query string from the relevant link's \`href\` with this history endpoint. Use \`changes_since\` when retrieving transactions modified since a previous synchronization, including transactions created earlier whose status has changed.`,
  parameters: listTransactionsV2_1Parameters,
  result: listTransactionsV2_1Result,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.transactions.list(merchantCode, args);
  },
  annotations: {
    title: `List transactions`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["transactions.history", "transactions.read"],
  },
};

export const refundTransaction: Tool<
  typeof refundTransactionParameters,
  typeof refundTransactionResult
> = {
  name: "refund_transaction",
  title: `Refund a transaction`,
  description: `Refunds a transaction identified by its SumUp transaction ID. Omit the request body to request a full refund, or provide \`amount\` for a partial refund in the transaction's currency.

Retrieve the transaction afterwards to inspect its refunded amount and refund events. The transaction must be eligible for a refund; see the error responses for invalid amounts, permissions, and processing failures.`,
  parameters: refundTransactionParameters,
  result: refundTransactionResult,
  callback: async (sumup: SumUp, { merchantCode, transactionId, ...args }) => {
    return await sumup.transactions.refund(merchantCode, transactionId, args);
  },
  annotations: {
    title: `Refund a transaction`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["payments", "refunds.write"],
  },
};
