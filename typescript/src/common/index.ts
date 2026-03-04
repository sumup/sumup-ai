export { VERSION } from "./const";

import {
  createCheckout,
  deactivateCheckout,
  getCheckout,
  getPaymentMethods,
  listCheckouts,
} from "./checkouts";
import {
  createCustomer,
  deactivatePaymentInstrument,
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
  createReader,
  createReaderCheckout,
  createReaderTerminate,
  deleteReader,
  getReader,
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

export const registerTools = (reg: (t: Tool) => void) => {
  reg(createCheckout);
  reg(createCustomer);
  reg(createMerchantMember);
  reg(createMerchantRole);
  reg(createReader);
  reg(createReaderCheckout);
  reg(createReaderTerminate);
  reg(deactivateCheckout);
  reg(deactivatePaymentInstrument);
  reg(deleteMerchantMember);
  reg(deleteMerchantRole);
  reg(deleteReader);
  reg(getCheckout);
  reg(getCustomer);
  reg(getMerchant);
  reg(getMerchantMember);
  reg(getMerchantRole);
  reg(getPaymentMethods);
  reg(getPerson);
  reg(getReader);
  reg(getReceipt);
  reg(getTransactionV2_1);
  reg(listCheckouts);
  reg(listMemberships);
  reg(listMerchantMembers);
  reg(listMerchantRoles);
  reg(listPaymentInstruments);
  reg(listPayoutsV1);
  reg(listPersons);
  reg(listReaders);
  reg(listTransactionsV2_1);
  reg(refundTransaction);
  reg(updateCustomer);
  reg(updateMerchantMember);
  reg(updateMerchantRole);
  reg(updateReader);
};
