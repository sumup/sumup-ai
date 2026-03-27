import type SumUp from "@sumup/sdk";
import type { Tool } from "../types";

import {
  createReaderCheckoutParameters,
  createReaderCheckoutResult,
  createReaderParameters,
  createReaderResult,
  createReaderTerminateParameters,
  createReaderTerminateResult,
  deleteReaderParameters,
  deleteReaderResult,
  getReaderParameters,
  getReaderResult,
  getReaderStatusParameters,
  getReaderStatusResult,
  listReadersParameters,
  listReadersResult,
  updateReaderParameters,
  updateReaderResult,
} from "./parameters";

export const createReader: Tool<
  typeof createReaderParameters,
  typeof createReaderResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const createReaderCheckout: Tool<
  typeof createReaderCheckoutParameters,
  typeof createReaderCheckoutResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const createReaderTerminate: Tool<
  typeof createReaderTerminateParameters,
  typeof createReaderTerminateResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const deleteReader: Tool<
  typeof deleteReaderParameters,
  typeof deleteReaderResult
> = {
  name: "delete_reader",
  title: `Delete a reader`,
  description: `Delete a reader.`,
  parameters: deleteReaderParameters,
  result: deleteReaderResult,
  callback: async (sumup: SumUp, { merchantCode, id, ...args }) => {
    return await sumup.readers.delete(merchantCode, id, args);
  },
  annotations: {
    title: `Delete a reader`,
    readOnly: false,
    destructive: true,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};

export const getReader: Tool<
  typeof getReaderParameters,
  typeof getReaderResult
> = {
  name: "get_reader",
  title: `Retrieve a Reader`,
  description: `Retrieve a Reader.`,
  parameters: getReaderParameters,
  result: getReaderResult,
  callback: async (sumup: SumUp, { merchantCode, id, ...args }) => {
    return await sumup.readers.get(merchantCode, id, args);
  },
  annotations: {
    title: `Retrieve a Reader`,
    readOnly: true,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read"],
  },
};

export const getReaderStatus: Tool<
  typeof getReaderStatusParameters,
  typeof getReaderStatusResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read"],
  },
};

export const listReaders: Tool<
  typeof listReadersParameters,
  typeof listReadersResult
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
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.read"],
  },
};

export const updateReader: Tool<
  typeof updateReaderParameters,
  typeof updateReaderResult
> = {
  name: "update_reader",
  title: `Update a Reader`,
  description: `Update a Reader.`,
  parameters: updateReaderParameters,
  result: updateReaderResult,
  callback: async (sumup: SumUp, { merchantCode, id, ...args }) => {
    return await sumup.readers.update(merchantCode, id, args);
  },
  annotations: {
    title: `Update a Reader`,
    readOnly: false,
    destructive: false,
    idempotent: false,
    oauthScopes: ["readers.write"],
  },
};
