import {
  createCheckout,
  deactivateCheckout,
  getCheckout,
  listCheckouts,
  updateCheckout,
} from "./checkouts";
import {
  createCustomer,
  getCustomer,
  listPaymentInstruments,
  updateCustomer,
} from "./customers";
import {
  createMerchantMember,
  deleteMerchantMember,
  getMerchantMember,
  listMerchantMembers,
  updateMerchantMember,
} from "./members";
import { listMemberships } from "./memberships";
import { getMerchant, getPerson, listPersons } from "./merchants";
import { listPayoutsV1 } from "./payouts";
import {
  createGoReaderCheckout,
  createReader,
  createReaderCheckout,
  createReaderTerminate,
  deleteReader,
  getReader,
  getReaderCheckout,
  getReaderStatus,
  listReaders,
  updateReader,
} from "./readers";
import { getReceipt } from "./receipts";
import {
  createMerchantRole,
  deleteMerchantRole,
  getMerchantRole,
  listMerchantRoles,
  updateMerchantRole,
} from "./roles";
import {
  getTransactionV2_1,
  listTransactionsV2_1,
  refundTransaction,
} from "./transactions";
import type { Tool } from "./types";

// Adding an API schema does not expose a tool; register reviewed wrappers here.
const tools = [
  createCheckout,
  createCustomer,
  createGoReaderCheckout,
  createMerchantMember,
  createMerchantRole,
  createReader,
  createReaderCheckout,
  createReaderTerminate,
  deactivateCheckout,
  deleteMerchantMember,
  deleteMerchantRole,
  deleteReader,
  getCheckout,
  getCustomer,
  getMerchant,
  getMerchantMember,
  getMerchantRole,
  getPerson,
  getReader,
  getReaderCheckout,
  getReaderStatus,
  getReceipt,
  getTransactionV2_1,
  listCheckouts,
  listMemberships,
  listMerchantMembers,
  listMerchantRoles,
  listPaymentInstruments,
  listPayoutsV1,
  listPersons,
  listReaders,
  listTransactionsV2_1,
  refundTransaction,
  updateCheckout,
  updateCustomer,
  updateMerchantMember,
  updateMerchantRole,
  updateReader,
] as const;

export type ToolName = (typeof tools)[number]["name"];

export const registerTools = (register: (tool: Tool) => void) => {
  for (const tool of tools) register(tool);
};
