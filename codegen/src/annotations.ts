type Annotations = {
  readOnly: boolean;
  openWorld: boolean;
  destructive: boolean;
};

// Reviewed against the API behavior, including optional modes and callbacks.
// Keep this policy in the toolkit rather than in shared API descriptions.
const readOnlyOperations = new Set([
  "GetCheckout",
  "GetCustomer",
  "GetMerchant",
  "GetMerchantMember",
  "GetMerchantRole",
  "GetPerson",
  "GetReader",
  "GetReaderCheckout",
  "GetReaderStatus",
  "GetReceipt",
  "GetTransactionV2.1",
  "ListCheckouts",
  "ListMemberships",
  "ListMerchantMembers",
  "ListMerchantRoles",
  "ListPaymentInstruments",
  "ListPayoutsV1",
  "ListPersons",
  "ListReaders",
  "ListTransactionsV2.1",
]);

const writeOperations: Record<string, Omit<Annotations, "readOnly">> = {
  // Optional caller-supplied external callbacks.
  CreateCheckout: { openWorld: true, destructive: false },
  UpdateCheckout: { openWorld: false, destructive: true },
  DeactivateCheckout: { openWorld: false, destructive: true },
  // Financial effects alone do not make a SumUp account operation open-world.
  CreateGoReaderCheckout: { openWorld: false, destructive: true },
  CreateReaderCheckout: { openWorld: true, destructive: true },
  CreateReaderTerminate: { openWorld: true, destructive: true },
  RefundTransaction: { openWorld: false, destructive: true },
  // The non-managed-user mode sends an invitation email.
  CreateMerchantMember: { openWorld: true, destructive: true },
  // Remaining writes are bounded to private merchant-account resources.
  CreateCustomer: { openWorld: false, destructive: false },
  UpdateCustomer: { openWorld: false, destructive: true },
  CreateMerchantRole: { openWorld: false, destructive: false },
  UpdateMerchantRole: { openWorld: false, destructive: true },
  DeleteMerchantRole: { openWorld: false, destructive: true },
  UpdateMerchantMember: { openWorld: false, destructive: true },
  DeleteMerchantMember: { openWorld: false, destructive: true },
  CreateReader: { openWorld: false, destructive: false },
  UpdateReader: { openWorld: false, destructive: true },
  DeleteReader: { openWorld: false, destructive: true },
};

/**
 * Returns the reviewed effects of all supported modes, including optional
 * callbacks. HTTP methods alone miss actions such as refunds and invitations.
 * Unknown operations or changed read/write methods require review before the
 * generator writes files, so new endpoints cannot silently inherit safe hints.
 *
 * @see https://modelcontextprotocol.io/specification/2025-11-25/schema#toolannotations
 */
export function annotationsForOperation(
  operationId: string,
  method: string,
): Annotations {
  const readOnly = readOnlyOperations.has(operationId);
  const write = Object.hasOwn(writeOperations, operationId)
    ? writeOperations[operationId]
    : undefined;
  if (!readOnly && !write) {
    throw new Error(`Review tool annotations for operation ${operationId}`);
  }
  if (readOnly !== (method === "get")) {
    throw new Error(`Review changed HTTP method for operation ${operationId}`);
  }
  return readOnly
    ? { readOnly: true, openWorld: false, destructive: false }
    : { readOnly: false, ...write! };
}
