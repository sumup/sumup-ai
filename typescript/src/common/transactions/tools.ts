import type SumUp from "@sumup/sdk";
import {
  getTransactionV2_1Parameters,
  getTransactionV2_1Result,
  listTransactionsV2_1Parameters,
  listTransactionsV2_1Result,
  refundTransactionParameters,
  refundTransactionResult,
} from "../generated/transactions";
import type { Tool } from "../types";

export const getTransactionV2_1: Tool<
  typeof getTransactionV2_1Parameters,
  typeof getTransactionV2_1Result,
  "get_transaction_v2_1"
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
  typeof listTransactionsV2_1Result,
  "list_transactions_v2_1"
> = {
  name: "list_transactions_v2_1",
  title: `List transactions`,
  description: `Lists detailed history of all transactions associated with the merchant profile.`,
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
  typeof refundTransactionResult,
  "refund_transaction"
> = {
  name: "refund_transaction",
  title: `Refund a transaction`,
  description: `Refunds an identified transaction either in full or partially.`,
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
