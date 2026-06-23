import { z } from "zod";

export const getTransactionV2_1Parameters = z.object({
  merchantCode: z
    .string()
    .describe(
      `Merchant code of the account whose transaction should be retrieved.`,
    ),
  id: z
    .string()
    .optional()
    .describe(
      `Retrieves the transaction resource with the specified transaction ID (the \`id\` parameter in the transaction resource).`,
    ),
  transaction_code: z
    .string()
    .optional()
    .describe(
      `Retrieves the transaction resource with the specified transaction code.`,
    ),
  foreign_transaction_id: z
    .string()
    .optional()
    .describe(`External/foreign transaction id (passed by clients).`),
  client_transaction_id: z
    .string()
    .optional()
    .describe(`Client transaction id.`),
});

export const getTransactionV2_1Result = z
  .object({
    id: z.string().describe(`Unique ID of the transaction.`).optional(),
    transaction_code: z
      .string()
      .describe(
        `Transaction code returned by the acquirer/processing entity after processing the transaction.`,
      )
      .optional(),
    amount: z.number().describe(`Total amount of the transaction.`).optional(),
    currency: z
      .enum([
        "BGN",
        "BRL",
        "CHF",
        "CLP",
        "COP",
        "CZK",
        "DKK",
        "EUR",
        "GBP",
        "HRK",
        "HUF",
        "NOK",
        "PLN",
        "RON",
        "SEK",
        "USD",
      ])
      .describe(
        `Three-letter [ISO4217](https://en.wikipedia.org/wiki/ISO_4217) code of the currency for the amount. Currently supported currency values are enumerated above.`,
      )
      .optional(),
    timestamp: z
      .string()
      .describe(
        `Date and time of the creation of the transaction. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
      )
      .optional(),
    status: z
      .enum(["SUCCESSFUL", "CANCELLED", "FAILED", "PENDING", "REFUNDED"])
      .describe(
        `Current status of the transaction.

- \`PENDING\`: The transaction has been created but its final outcome is not known yet.
- \`SUCCESSFUL\`: The transaction completed successfully.
- \`CANCELLED\`: The transaction was cancelled or otherwise reversed before completion.
- \`FAILED\`: The transaction attempt did not complete successfully.
- \`REFUNDED\`: The transaction was refunded in full or in part.`,
      )
      .optional(),
    payment_type: z
      .enum([
        "CASH",
        "POS",
        "ECOM",
        "RECURRING",
        "BITCOIN",
        "BALANCE",
        "MOTO",
        "BOLETO",
        "DIRECT_DEBIT",
        "APM",
        "UNKNOWN",
      ])
      .describe(`Payment type used for the transaction.`)
      .optional(),
    installments_count: z
      .number()
      .int()
      .describe(`Current number of the installment for deferred payments.`)
      .optional(),
    merchant_code: z
      .string()
      .describe(
        `Unique code of the registered merchant to whom the payment is made.`,
      )
      .optional(),
    vat_amount: z
      .number()
      .describe(
        `Amount of the applicable VAT (out of the total transaction amount).`,
      )
      .optional(),
    tip_amount: z
      .number()
      .describe(`Amount of the tip (out of the total transaction amount).`)
      .optional(),
    entry_mode: z
      .enum([
        "BOLETO",
        "SOFORT",
        "IDEAL",
        "BANCONTACT",
        "EPS",
        "MYBANK",
        "SATISPAY",
        "BLIK",
        "P24",
        "GIROPAY",
        "PIX",
        "QR_CODE_PIX",
        "APPLE_PAY",
        "GOOGLE_PAY",
        "PAYPAL",
        "TWINT",
        "NONE",
        "CHIP",
        "MANUAL_ENTRY",
        "CUSTOMER_ENTRY",
        "MAGSTRIPE_FALLBACK",
        "MAGSTRIPE",
        "DIRECT_DEBIT",
        "CONTACTLESS",
        "MOTO",
        "CONTACTLESS_MAGSTRIPE",
        "N/A",
      ])
      .describe(`Entry mode of the payment details.`)
      .optional(),
    auth_code: z
      .string()
      .describe(
        `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
      )
      .optional(),
    product_summary: z
      .string()
      .describe(
        `Short description of the payment. The value is taken from the \`description\` property of the related checkout resource.`,
      )
      .optional(),
    payouts_total: z
      .number()
      .int()
      .describe(
        `Total number of payouts to the registered user specified in the \`user\` property.`,
      )
      .optional(),
    payouts_received: z
      .number()
      .int()
      .describe(
        `Number of payouts that are made to the registered user specified in the \`user\` property.`,
      )
      .optional(),
    payout_plan: z
      .enum(["SINGLE_PAYMENT", "TRUE_INSTALLMENT", "ACCELERATED_INSTALLMENT"])
      .describe(
        `Payout plan of the registered user at the time when the transaction was made.`,
      )
      .optional(),
    foreign_transaction_id: z
      .string()
      .describe(`External/foreign transaction id (passed by clients).`)
      .optional(),
    client_transaction_id: z
      .string()
      .describe(`Client transaction id.`)
      .optional(),
    username: z
      .string()
      .describe(
        `Email address of the registered user (merchant) to whom the payment is made.`,
      )
      .optional(),
    fee_amount: z
      .number()
      .describe(`Transaction SumUp total fee amount.`)
      .optional(),
    lat: z
      .number()
      .describe(
        `Latitude value from the coordinates of the payment location (as received from the payment terminal reader).`,
      )
      .optional(),
    lon: z
      .number()
      .describe(
        `Longitude value from the coordinates of the payment location (as received from the payment terminal reader).`,
      )
      .optional(),
    horizontal_accuracy: z
      .number()
      .describe(
        `Indication of the precision of the geographical position received from the payment terminal.`,
      )
      .optional(),
    merchant_id: z
      .number()
      .int()
      .describe(`SumUp merchant internal Id.`)
      .optional(),
    device_info: z
      .object({
        name: z.string().describe(`Device name.`).optional(),
        system_name: z.string().describe(`Device OS.`).optional(),
        model: z.string().describe(`Device model.`).optional(),
        system_version: z.string().describe(`Device OS version.`).optional(),
        uuid: z.string().describe(`Device UUID.`).optional(),
      })
      .describe(`Details of the device used to create the transaction.`)
      .optional(),
    simple_payment_type: z
      .enum([
        "CASH",
        "CC_SIGNATURE",
        "ELV",
        "ELV_WITHOUT_SIGNATURE",
        "CC_CUSTOMER_ENTERED",
        "MANUAL_ENTRY",
        "EMV",
        "RECURRING",
        "BALANCE",
        "MOTO",
        "BOLETO",
        "APM",
        "BITCOIN",
        "CARD",
      ])
      .describe(`Simple name of the payment type.`)
      .optional(),
    verification_method: z
      .enum([
        "none",
        "signature",
        "offline PIN",
        "online PIN",
        "offline PIN + signature",
        "na",
      ])
      .describe(`Verification method used for the transaction.`)
      .optional(),
    card: z
      .object({
        last_4_digits: z
          .string()
          .min(4)
          .max(4)
          .describe(`Last 4 digits of the payment card number.`)
          .optional(),
        type: z
          .enum([
            "ALELO",
            "AMEX",
            "CONECS",
            "CUP",
            "DINERS",
            "DISCOVER",
            "EFTPOS",
            "ELO",
            "ELV",
            "GIROCARD",
            "HIPERCARD",
            "INTERAC",
            "JCB",
            "MAESTRO",
            "MASTERCARD",
            "PLUXEE",
            "SWILE",
            "TICKET",
            "VISA",
            "VISA_ELECTRON",
            "VISA_VPAY",
            "VPAY",
            "VR",
            "UNKNOWN",
          ])
          .describe(
            `Issuing card network of the payment card used for the transaction.`,
          )
          .optional(),
      })
      .describe(`Details of the payment card.`)
      .optional(),
    elv_account: z
      .object({
        sort_code: z.string().describe(`ELV card sort code.`).optional(),
        last_4_digits: z
          .string()
          .describe(`ELV card account number last 4 digits.`)
          .optional(),
        sequence_no: z
          .number()
          .int()
          .describe(`ELV card sequence number.`)
          .optional(),
        iban: z.string().describe(`ELV IBAN.`).optional(),
      })
      .describe(
        `Details of the ELV card account associated with the transaction.`,
      )
      .optional(),
    local_time: z
      .string()
      .describe(`Local date and time of the creation of the transaction.`)
      .optional(),
    payout_date: z.string().describe(`The date of the payout.`).optional(),
    payout_type: z
      .enum(["BANK_ACCOUNT", "PREPAID_CARD"])
      .describe(`Payout type for the transaction.`)
      .optional(),
    process_as: z
      .enum(["CREDIT", "DEBIT"])
      .describe(`Debit/Credit.`)
      .optional(),
    products: z
      .array(
        z
          .object({
            name: z.string().describe(`Product name.`).optional(),
            price_label: z.string().describe(`Product description.`).optional(),
            price: z.number().describe(`Product price.`).optional(),
            vat_rate: z.number().describe(`VAT percentage.`).optional(),
            single_vat_amount: z
              .number()
              .describe(`VAT amount for a single product.`)
              .optional(),
            price_with_vat: z
              .number()
              .describe(`Product price incl. VAT.`)
              .optional(),
            vat_amount: z.number().describe(`VAT amount.`).optional(),
            quantity: z.number().int().describe(`Product quantity.`).optional(),
            total_price: z
              .number()
              .describe(`Quantity x product price.`)
              .optional(),
            total_with_vat: z
              .number()
              .describe(`Total price incl. VAT.`)
              .optional(),
          })
          .describe(`Purchase product.`),
      )
      .describe(
        `List of products from the merchant's catalogue for which the transaction serves as a payment.`,
      )
      .optional(),
    vat_rates: z
      .array(
        z.object({
          rate: z.number().describe(`VAT rate.`).optional(),
          net: z
            .number()
            .describe(`NET amount of products having this VAT rate applied.`)
            .optional(),
          vat: z
            .number()
            .describe(`VAT amount of this rate applied.`)
            .optional(),
          gross: z
            .number()
            .describe(`Gross amount of products having this VAT rate applied.`)
            .optional(),
        }),
      )
      .describe(`List of VAT rates applicable to the transaction.`)
      .optional(),
    transaction_events: z
      .array(
        z
          .object({
            id: z
              .number()
              .int()
              .describe(`Unique ID of the transaction event.`)
              .optional(),
            event_type: z
              .enum(["PAYOUT", "CHARGE_BACK", "REFUND", "PAYOUT_DEDUCTION"])
              .describe(`Type of the transaction event.`)
              .optional(),
            status: z
              .enum([
                "FAILED",
                "PAID_OUT",
                "PENDING",
                "RECONCILED",
                "REFUNDED",
                "SCHEDULED",
                "SUCCESSFUL",
              ])
              .describe(
                `Status of the transaction event.

Not every value is used for every event type.

- \`PENDING\`: The event has been created but is not final yet. Used for events that are still being processed and whose final outcome is not known yet.
- \`SCHEDULED\`: The event is planned for a future payout cycle but has not been executed yet. This applies to payout events before money is actually sent out.
- \`RECONCILED\`: The underlying payment has been matched with settlement data and is ready to continue through payout processing, but the funds have not been paid out yet. This applies to payout events.
- \`PAID_OUT\`: The payout event has been completed and the funds were included in a merchant payout.
- \`REFUNDED\`: A refund event has been accepted and recorded in the refund flow. This is the status returned for refund events once the transaction amount is being or has been returned to the payer.
- \`SUCCESSFUL\`: The event completed successfully. Use this as the generic terminal success status for event types that do not expose a more specific business outcome such as \`PAID_OUT\` or \`REFUNDED\`.
- \`FAILED\`: The event could not be completed. Typical examples are a payout that could not be executed or an event that was rejected during processing.`,
              )
              .optional(),
            amount: z.number().describe(`Amount of the event.`).optional(),
            due_date: z
              .string()
              .describe(`Date when the transaction event is due to occur.`)
              .optional(),
            date: z
              .string()
              .describe(`Date when the transaction event occurred.`)
              .optional(),
            installment_number: z
              .number()
              .int()
              .describe(
                `Consecutive number of the installment that is paid. Applicable only payout events, i.e. \`event_type = PAYOUT\`.`,
              )
              .optional(),
            timestamp: z
              .string()
              .describe(`Date and time of the transaction event.`)
              .optional(),
          })
          .describe(`Detailed information about a transaction event.`),
      )
      .describe(`Detailed list of events related to the transaction.`)
      .optional(),
    simple_status: z
      .enum([
        "SUCCESSFUL",
        "PAID_OUT",
        "CANCEL_FAILED",
        "CANCELLED",
        "CHARGEBACK",
        "FAILED",
        "REFUND_FAILED",
        "REFUNDED",
        "NON_COLLECTION",
        "PENDING",
      ])
      .describe(
        `High-level status of the transaction from the merchant's perspective.

- \`PENDING\`: The payment has been initiated and is still being processed. A final outcome is not available yet.
- \`SUCCESSFUL\`: The payment was completed successfully.
- \`PAID_OUT\`: The payment was completed successfully and the funds have already been included in a payout to the merchant.
- \`FAILED\`: The payment did not complete successfully.
- \`CANCELLED\`: The payment was cancelled or reversed and is no longer payable or payable to the merchant.
- \`CANCEL_FAILED\`: An attempt to cancel or reverse the payment was not completed successfully.
- \`REFUNDED\`: The payment was refunded in full or in part.
- \`REFUND_FAILED\`: An attempt to refund the payment was not completed successfully.
- \`CHARGEBACK\`: The payment was subject to a chargeback.
- \`NON_COLLECTION\`: The amount could not be collected from the merchant after a chargeback or related adjustment.`,
      )
      .optional(),
    links: z
      .array(
        z
          .object({
            rel: z
              .string()
              .describe(`Specifies the relation to the current resource.`)
              .optional(),
            href: z
              .string()
              .describe(`URL for accessing the related resource.`)
              .optional(),
            type: z
              .string()
              .describe(`Specifies the media type of the related resource.`)
              .optional(),
            min_amount: z
              .number()
              .describe(`Minimum allowed amount for the refund.`)
              .optional(),
            max_amount: z
              .number()
              .describe(`Maximum allowed amount for the refund.`)
              .optional(),
          })
          .describe(`Details of a link to a related resource.`),
      )
      .describe(`List of hyperlinks for accessing related resources.`)
      .optional(),
    events: z
      .array(
        z
          .object({
            id: z
              .number()
              .int()
              .describe(`Unique ID of the transaction event.`)
              .optional(),
            transaction_id: z
              .string()
              .describe(`Unique ID of the transaction.`)
              .optional(),
            type: z
              .enum(["PAYOUT", "CHARGE_BACK", "REFUND", "PAYOUT_DEDUCTION"])
              .describe(`Type of the transaction event.`)
              .optional(),
            status: z
              .enum([
                "FAILED",
                "PAID_OUT",
                "PENDING",
                "RECONCILED",
                "REFUNDED",
                "SCHEDULED",
                "SUCCESSFUL",
              ])
              .describe(
                `Status of the transaction event.

Not every value is used for every event type.

- \`PENDING\`: The event has been created but is not final yet. Used for events that are still being processed and whose final outcome is not known yet.
- \`SCHEDULED\`: The event is planned for a future payout cycle but has not been executed yet. This applies to payout events before money is actually sent out.
- \`RECONCILED\`: The underlying payment has been matched with settlement data and is ready to continue through payout processing, but the funds have not been paid out yet. This applies to payout events.
- \`PAID_OUT\`: The payout event has been completed and the funds were included in a merchant payout.
- \`REFUNDED\`: A refund event has been accepted and recorded in the refund flow. This is the status returned for refund events once the transaction amount is being or has been returned to the payer.
- \`SUCCESSFUL\`: The event completed successfully. Use this as the generic terminal success status for event types that do not expose a more specific business outcome such as \`PAID_OUT\` or \`REFUNDED\`.
- \`FAILED\`: The event could not be completed. Typical examples are a payout that could not be executed or an event that was rejected during processing.`,
              )
              .optional(),
            amount: z.number().describe(`Amount of the event.`).optional(),
            timestamp: z
              .string()
              .describe(`Date and time of the transaction event.`)
              .optional(),
            fee_amount: z
              .number()
              .describe(`Amount of the fee related to the event.`)
              .optional(),
            installment_number: z
              .number()
              .int()
              .describe(`Consecutive number of the installment.`)
              .optional(),
            deducted_amount: z
              .number()
              .describe(`Amount deducted for the event.`)
              .optional(),
            deducted_fee_amount: z
              .number()
              .describe(`Amount of the fee deducted for the event.`)
              .optional(),
          })
          .describe(`High-level transaction event details.`),
      )
      .describe(`Compact list of events related to the transaction.`)
      .optional(),
    location: z
      .object({
        lat: z
          .number()
          .describe(
            `Latitude value from the coordinates of the payment location (as received from the payment terminal reader).`,
          )
          .optional(),
        lon: z
          .number()
          .describe(
            `Longitude value from the coordinates of the payment location (as received from the payment terminal reader).`,
          )
          .optional(),
        horizontal_accuracy: z
          .number()
          .describe(
            `Indication of the precision of the geographical position received from the payment terminal.`,
          )
          .optional(),
      })
      .describe(
        `Details of the payment location as received from the payment terminal.`,
      )
      .optional(),
    tax_enabled: z
      .boolean()
      .describe(
        `Indicates whether tax deduction is enabled for the transaction.`,
      )
      .optional(),
  })
  .loose()
  .describe(
    `Full transaction resource with checkout, payout, and event details.`,
  );

export const listTransactionsV2_1Parameters = z.object({
  merchantCode: z
    .string()
    .describe(
      `Merchant code of the account whose transaction history should be listed.`,
    ),
  transaction_code: z
    .string()
    .optional()
    .describe(
      `Retrieves the transaction resource with the specified transaction code.`,
    ),
  order: z
    .enum(["ascending", "descending"])
    .optional()
    .describe(
      `Specifies the order in which the returned results are displayed.`,
    ),
  limit: z
    .number()
    .int()
    .optional()
    .describe(
      `Specifies the maximum number of results per page. Value must be a positive integer and if not specified, will return 10 results.`,
    ),
  "users[]": z
    .array(z.string())
    .optional()
    .describe(`Filters the returned results by user email.`),
  "statuses[]": z
    .array(
      z.enum(["SUCCESSFUL", "CANCELLED", "FAILED", "REFUNDED", "CHARGE_BACK"]),
    )
    .optional()
    .describe(
      `Filters the returned results by the specified list of final statuses of the transactions.`,
    ),
  "payment_types[]": z
    .array(
      z
        .enum([
          "CASH",
          "POS",
          "ECOM",
          "RECURRING",
          "BITCOIN",
          "BALANCE",
          "MOTO",
          "BOLETO",
          "DIRECT_DEBIT",
          "APM",
          "UNKNOWN",
        ])
        .describe(`Payment type used for the transaction.`),
    )
    .optional()
    .describe(
      `Filters the returned results by the specified list of payment types used for the transactions.`,
    ),
  "entry_modes[]": z
    .array(
      z
        .enum([
          "BOLETO",
          "SOFORT",
          "IDEAL",
          "BANCONTACT",
          "EPS",
          "MYBANK",
          "SATISPAY",
          "BLIK",
          "P24",
          "GIROPAY",
          "PIX",
          "QR_CODE_PIX",
          "APPLE_PAY",
          "GOOGLE_PAY",
          "PAYPAL",
          "TWINT",
          "NONE",
          "CHIP",
          "MANUAL_ENTRY",
          "CUSTOMER_ENTRY",
          "MAGSTRIPE_FALLBACK",
          "MAGSTRIPE",
          "DIRECT_DEBIT",
          "CONTACTLESS",
          "MOTO",
          "CONTACTLESS_MAGSTRIPE",
          "N/A",
        ])
        .describe(`Entry mode of the payment details.`),
    )
    .optional()
    .describe(
      `Filters the returned results by the specified list of entry modes.`,
    ),
  "types[]": z
    .array(z.enum(["PAYMENT", "REFUND", "CHARGE_BACK"]))
    .optional()
    .describe(
      `Filters the returned results by the specified list of transaction types.`,
    ),
  changes_since: z
    .string()
    .optional()
    .describe(
      `Filters the results by the latest modification time of resources and returns only transactions that are modified *at or after* the specified timestamp (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format).`,
    ),
  newest_time: z
    .string()
    .optional()
    .describe(
      `Filters the results by the creation time of resources and returns only transactions that are created *before* the specified timestamp (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format).`,
    ),
  newest_ref: z
    .string()
    .optional()
    .describe(
      `Filters the results by the reference ID of transaction events and returns only transactions with events whose IDs are *smaller* than the specified value. This parameters supersedes the \`newest_time\` parameter (if both are provided in the request).`,
    ),
  oldest_time: z
    .string()
    .optional()
    .describe(
      `Filters the results by the creation time of resources and returns only transactions that are created *at or after* the specified timestamp (in [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) format).`,
    ),
  oldest_ref: z
    .string()
    .optional()
    .describe(
      `Filters the results by the reference ID of transaction events and returns only transactions with events whose IDs are *greater* than the specified value. This parameters supersedes the \`oldest_time\` parameter (if both are provided in the request).`,
    ),
});

export const listTransactionsV2_1Result = z
  .object({
    items: z
      .array(
        z
          .object({
            id: z.string().describe(`Unique ID of the transaction.`).optional(),
            transaction_code: z
              .string()
              .describe(
                `Transaction code returned by the acquirer/processing entity after processing the transaction.`,
              )
              .optional(),
            amount: z
              .number()
              .describe(`Total amount of the transaction.`)
              .optional(),
            currency: z
              .enum([
                "BGN",
                "BRL",
                "CHF",
                "CLP",
                "COP",
                "CZK",
                "DKK",
                "EUR",
                "GBP",
                "HRK",
                "HUF",
                "NOK",
                "PLN",
                "RON",
                "SEK",
                "USD",
              ])
              .describe(
                `Three-letter [ISO4217](https://en.wikipedia.org/wiki/ISO_4217) code of the currency for the amount. Currently supported currency values are enumerated above.`,
              )
              .optional(),
            timestamp: z
              .string()
              .describe(
                `Date and time of the creation of the transaction. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
              )
              .optional(),
            status: z
              .enum([
                "SUCCESSFUL",
                "CANCELLED",
                "FAILED",
                "PENDING",
                "REFUNDED",
              ])
              .describe(
                `Current status of the transaction.

- \`PENDING\`: The transaction has been created but its final outcome is not known yet.
- \`SUCCESSFUL\`: The transaction completed successfully.
- \`CANCELLED\`: The transaction was cancelled or otherwise reversed before completion.
- \`FAILED\`: The transaction attempt did not complete successfully.
- \`REFUNDED\`: The transaction was refunded in full or in part.`,
              )
              .optional(),
            payment_type: z
              .enum([
                "CASH",
                "POS",
                "ECOM",
                "RECURRING",
                "BITCOIN",
                "BALANCE",
                "MOTO",
                "BOLETO",
                "DIRECT_DEBIT",
                "APM",
                "UNKNOWN",
              ])
              .describe(`Payment type used for the transaction.`)
              .optional(),
            installments_count: z
              .number()
              .int()
              .describe(
                `Current number of the installment for deferred payments.`,
              )
              .optional(),
            product_summary: z
              .string()
              .describe(
                `Short description of the payment. The value is taken from the \`description\` property of the related checkout resource.`,
              )
              .optional(),
            payouts_total: z
              .number()
              .int()
              .describe(
                `Total number of payouts to the registered user specified in the \`user\` property.`,
              )
              .optional(),
            payouts_received: z
              .number()
              .int()
              .describe(
                `Number of payouts that are made to the registered user specified in the \`user\` property.`,
              )
              .optional(),
            payout_plan: z
              .enum([
                "SINGLE_PAYMENT",
                "TRUE_INSTALLMENT",
                "ACCELERATED_INSTALLMENT",
              ])
              .describe(
                `Payout plan of the registered user at the time when the transaction was made.`,
              )
              .optional(),
            transaction_id: z
              .string()
              .describe(`Unique ID of the transaction.`)
              .optional(),
            client_transaction_id: z
              .string()
              .describe(`Client-specific ID of the transaction.`)
              .optional(),
            user: z
              .string()
              .describe(
                `Email address of the registered user (merchant) to whom the payment is made.`,
              )
              .optional(),
            type: z
              .enum(["PAYMENT", "REFUND", "CHARGE_BACK"])
              .describe(
                `Type of the transaction for the registered user specified in the \`user\` property.`,
              )
              .optional(),
            card_type: z
              .enum([
                "ALELO",
                "AMEX",
                "CONECS",
                "CUP",
                "DINERS",
                "DISCOVER",
                "EFTPOS",
                "ELO",
                "ELV",
                "GIROCARD",
                "HIPERCARD",
                "INTERAC",
                "JCB",
                "MAESTRO",
                "MASTERCARD",
                "PLUXEE",
                "SWILE",
                "TICKET",
                "VISA",
                "VISA_ELECTRON",
                "VISA_VPAY",
                "VPAY",
                "VR",
                "UNKNOWN",
              ])
              .describe(
                `Issuing card network of the payment card used for the transaction.`,
              )
              .optional(),
            payout_date: z
              .string()
              .describe(`Payout date (if paid out at once).`)
              .optional(),
            payout_type: z
              .enum(["BANK_ACCOUNT", "PREPAID_CARD"])
              .describe(`Payout type.`)
              .optional(),
            refunded_amount: z
              .number()
              .describe(`Total refunded amount.`)
              .optional(),
          })
          .describe(`Transaction entry returned in history listing responses.`),
      )
      .optional(),
    links: z
      .array(
        z
          .object({
            rel: z.string().describe(`Relation.`),
            href: z.string().describe(`Location.`),
          })
          .describe(`Hypermedia link used for transaction history pagination.`),
      )
      .optional(),
  })
  .loose()
  .describe(`Returns a page of transaction history items.`);

export const refundTransactionParameters = z
  .object({
    merchantCode: z
      .string()
      .describe(
        `Merchant code of the account that owns the payment to refund.`,
      ),
    transactionId: z.string().describe(`Unique ID of the transaction.`),
    amount: z
      .number()
      .describe(
        `Amount to be refunded. Eligible amount can't exceed the amount of the transaction and varies based on country and currency. If you do not specify a value, the system performs a full refund of the transaction.`,
      )
      .optional(),
  })
  .describe(`Optional amount for partial refunds of transactions.`);

export const refundTransactionResult = z.any();
