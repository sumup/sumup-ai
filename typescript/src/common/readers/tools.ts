import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";
import {
  createGoReaderCheckoutParameters,
  createGoReaderCheckoutResult,
  createReaderCheckoutParameters,
  createReaderCheckoutResult,
  createReaderParameters,
  createReaderResult,
  createReaderTerminateParameters,
  createReaderTerminateResult,
  deleteReaderParameters,
  deleteReaderResult,
  getReaderCheckoutParameters,
  getReaderCheckoutResult,
  getReaderParameters,
  getReaderResult,
  getReaderStatusParameters,
  getReaderStatusResult,
  listReadersParameters,
  listReadersResult,
  updateReaderParameters,
  updateReaderResult,
} from "./parameters";

export const createGoReaderCheckout: Tool<
  typeof createGoReaderCheckoutParameters,
  typeof createGoReaderCheckoutResult,
  "create_go_reader_checkout"
> = {
  name: "create_go_reader_checkout",
  title: `Create a Go Reader Payment`,
  description: `Initiates a payment on the SumUp Go terminal identified by the reader ID.

Use \`client_transaction_id\` as an idempotency key: retrying the request with the same value returns the result of the original payment instead of creating a duplicate.`,
  parameters: createGoReaderCheckoutParameters,
  result: createGoReaderCheckoutResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.createGoCheckout(merchantCode, readerId, args);
  },
  annotations: {
    title: `Create a Go Reader Payment`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["payments", "readers.write"],
  },
};

export const createReader: Tool<
  typeof createReaderParameters,
  typeof createReaderResult,
  "create_reader"
> = {
  name: "create_reader",
  title: `Create a Reader`,
  description: `Create a new Reader for the merchant account.`,
  parameters: createReaderParameters,
  result: createReaderResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.readers.create(merchantCode, args);
  },
  annotations: {
    title: `Create a Reader`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.write", "terminals.write"],
  },
};

export const createReaderCheckout: Tool<
  typeof createReaderCheckoutParameters,
  typeof createReaderCheckoutResult,
  "create_reader_checkout"
> = {
  name: "create_reader_checkout",
  title: `Create a Reader Checkout`,
  description: `Creates a Checkout for a Reader.

This process is asynchronous and the actual transaction may take some time to be started on the device.


There are some caveats when using this endpoint:
* The target device must be online, otherwise checkout won't be accepted
* After the checkout is accepted, the system has 60 seconds to start the payment on the target device. During this time, any other checkout for the same device will be rejected.


**Note**: If the target device is a Solo, it must be in version 3.3.24.3 or higher.`,
  parameters: createReaderCheckoutParameters,
  result: createReaderCheckoutResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.createCheckout(merchantCode, readerId, args);
  },
  annotations: {
    title: `Create a Reader Checkout`,
    readOnly: false,
    openWorld: true,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const createReaderTerminate: Tool<
  typeof createReaderTerminateParameters,
  typeof createReaderTerminateResult,
  "create_reader_terminate"
> = {
  name: "create_reader_terminate",
  title: `Terminate a Reader Checkout`,
  description: `Terminate a Reader Checkout stops the current transaction on the target device.

This process is asynchronous and the actual termination may take some time to be performed on the device.


There are some caveats when using this endpoint:
* The target device must be online, otherwise terminate won't be accepted
* The action will succeed only if the device is waiting for cardholder action: e.g: waiting for card, waiting for PIN, etc.
* There is no confirmation of the termination.

If a transaction is successfully terminated and \`return_url\` was provided on Checkout, the transaction status will be sent as \`failed\` to the provided URL.


**Note**: If the target device is a Solo, it must be in version 3.3.28.0 or higher.`,
  parameters: createReaderTerminateParameters,
  result: createReaderTerminateResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.terminateCheckout(merchantCode, readerId, args);
  },
  annotations: {
    title: `Terminate a Reader Checkout`,
    readOnly: false,
    openWorld: true,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const deleteReader: Tool<
  typeof deleteReaderParameters,
  typeof deleteReaderResult,
  "delete_reader"
> = {
  name: "delete_reader",
  title: `Delete a reader`,
  description: `Delete a reader.`,
  parameters: deleteReaderParameters,
  result: deleteReaderResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.delete(merchantCode, readerId, args);
  },
  annotations: {
    title: `Delete a reader`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["readers.write", "terminals.write"],
  },
};

export const getReader: Tool<
  typeof getReaderParameters,
  typeof getReaderResult,
  "get_reader"
> = {
  name: "get_reader",
  title: `Retrieve a Reader`,
  description: `Retrieve a Reader.`,
  parameters: getReaderParameters,
  result: getReaderResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.get(merchantCode, readerId, args);
  },
  annotations: {
    title: `Retrieve a Reader`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read", "terminals.read"],
  },
};

export const getReaderCheckout: Tool<
  typeof getReaderCheckoutParameters,
  typeof getReaderCheckoutResult,
  "get_reader_checkout"
> = {
  name: "get_reader_checkout",
  title: `Get a Reader Checkout`,
  description: `Get a Checkout for a Reader.`,
  parameters: getReaderCheckoutParameters,
  result: getReaderCheckoutResult,
  callback: async (
    sumup: SumUp,
    { merchantCode, readerId, checkoutId, ...args },
  ) => {
    return await sumup.readers.getCheckout(
      merchantCode,
      readerId,
      checkoutId,
      args,
    );
  },
  annotations: {
    title: `Get a Reader Checkout`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read"],
  },
};

export const getReaderStatus: Tool<
  typeof getReaderStatusParameters,
  typeof getReaderStatusResult,
  "get_reader_status"
> = {
  name: "get_reader_status",
  title: `Get a Reader Status`,
  description: `Provides the last known status for a Reader.

This endpoint allows you to retrieve updates from the connected card reader, including the current screen being displayed during the payment process and the device status (battery level, connectivity, and update state).

Supported States

* \`IDLE\` – Reader ready for next transaction
* \`SELECTING_TIP\` – Waiting for tip input
* \`WAITING_FOR_CARD\` – Awaiting card insert/tap
* \`WAITING_FOR_PIN\` – Waiting for PIN entry
* \`WAITING_FOR_SIGNATURE\` – Waiting for customer signature
* \`UPDATING_FIRMWARE\` – Firmware update in progress

Device Status

* \`ONLINE\` – Device connected and operational
* \`OFFLINE\` – Device disconnected (last state persisted)

**Note**: If the target device is a Solo, it must be in version 3.3.39.0 or higher.`,
  parameters: getReaderStatusParameters,
  result: getReaderStatusResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.getStatus(merchantCode, readerId, args);
  },
  annotations: {
    title: `Get a Reader Status`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read"],
  },
};

export const listReaders: Tool<
  typeof listReadersParameters,
  typeof listReadersResult,
  "list_readers"
> = {
  name: "list_readers",
  title: `List Readers`,
  description: `List all readers of the merchant.`,
  parameters: listReadersParameters,
  result: listReadersResult,
  callback: async (sumup: SumUp, { merchantCode, ...args }) => {
    return await sumup.readers.list(merchantCode, args);
  },
  annotations: {
    title: `List Readers`,
    readOnly: true,
    openWorld: false,
    requiresApproval: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read", "terminals.read"],
  },
};

export const updateReader: Tool<
  typeof updateReaderParameters,
  typeof updateReaderResult,
  "update_reader"
> = {
  name: "update_reader",
  title: `Update a Reader`,
  description: `Updates a reader's name or metadata and returns the updated reader.

Providing \`metadata\` replaces the entire metadata object; include all entries that should be retained. Omitted fields remain unchanged.`,
  parameters: updateReaderParameters,
  result: updateReaderResult,
  callback: async (sumup: SumUp, { merchantCode, readerId, ...args }) => {
    return await sumup.readers.update(merchantCode, readerId, args);
  },
  annotations: {
    title: `Update a Reader`,
    readOnly: false,
    openWorld: false,
    requiresApproval: true,
    destructive: true,
    idempotent: false,
    oauthScopes: ["readers.write", "terminals.write"],
  },
};
