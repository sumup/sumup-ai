import { z } from "zod";

export const getTransactionV2_1Parameters = z.object({
  merchantCode: z.string(),
  id: z
    .string()
    .optional()
    .describe(
      `Retrieves the transaction resource with the specified transaction ID (the \`id\` parameter in the transaction resource).`,
    ),
  internal_id: z
    .string()
    .optional()
    .describe(
      `Retrieves the transaction resource with the specified internal transaction ID (the \`internal_id\` parameter in the transaction resource).`,
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
      .enum(["SUCCESSFUL", "CANCELLED", "FAILED", "PENDING"])
      .describe(`Current status of the transaction.`)
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
        "none",
        "magstripe",
        "chip",
        "manual entry",
        "customer entry",
        "magstripe fallback",
        "contactless",
        "moto",
        "contactless magstripe",
        "boleto",
        "direct debit",
        "sofort",
        "ideal",
        "bancontact",
        "eps",
        "mybank",
        "satispay",
        "blik",
        "p24",
        "giropay",
        "pix",
        "qr code pix",
        "apple pay",
        "google pay",
        "paypal",
        "na",
      ])
      .describe(`Entry mode of the payment details.`)
      .optional(),
    auth_code: z
      .string()
      .describe(
        `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
      )
      .optional(),
    internal_id: z
      .number()
      .int()
      .describe(`Internal unique ID of the transaction on the SumUp platform.`)
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
    username: z
      .string()
      .describe(
        `Email address of the registered user (merchant) to whom the payment is made.`,
      )
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
    simple_payment_type: z
      .enum([
        "MOTO",
        "CASH",
        "CC_SIGNATURE",
        "ELV",
        "CC_CUSTOMER_ENTERED",
        "MANUAL_ENTRY",
        "EMV",
      ])
      .describe(`Simple name of the payment type.`)
      .optional(),
    verification_method: z
      .enum([
        "none",
        "na",
        "signature",
        "offline PIN",
        "online PIN",
        "offline PIN + signature",
        "confirmation code verified",
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
    local_time: z
      .string()
      .describe(`Local date and time of the creation of the transaction.`)
      .optional(),
    payout_type: z
      .enum(["BANK_ACCOUNT", "BALANCE", "PREPAID_CARD"])
      .describe(`Payout type for the transaction.`)
      .optional(),
    products: z
      .array(
        z
          .object({
            name: z
              .string()
              .describe(`Name of the product from the merchant's catalog.`)
              .optional(),
            price: z
              .number()
              .describe(`Price of the product without VAT.`)
              .optional(),
            vat_rate: z
              .number()
              .describe(`VAT rate applicable to the product.`)
              .optional(),
            single_vat_amount: z
              .number()
              .describe(
                `Amount of the VAT for a single product item (calculated as the product of \`price\` and \`vat_rate\`, i.e. \`single_vat_amount = price * vat_rate\`).`,
              )
              .optional(),
            price_with_vat: z
              .number()
              .describe(`Price of a single product item with VAT.`)
              .optional(),
            vat_amount: z
              .number()
              .describe(
                `Total VAT amount for the purchase (calculated as the product of \`single_vat_amount\` and \`quantity\`, i.e. \`vat_amount = single_vat_amount * quantity\`).`,
              )
              .optional(),
            quantity: z
              .number()
              .describe(`Number of product items for the purchase.`)
              .optional(),
            total_price: z
              .number()
              .describe(
                `Total price of the product items without VAT (calculated as the product of \`price\` and \`quantity\`, i.e. \`total_price = price * quantity\`).`,
              )
              .optional(),
            total_with_vat: z
              .number()
              .describe(
                `Total price of the product items including VAT (calculated as the product of \`price_with_vat\` and \`quantity\`, i.e. \`total_with_vat = price_with_vat * quantity\`).`,
              )
              .optional(),
          })
          .describe(`Details of the product for which the payment is made.`),
      )
      .describe(
        `List of products from the merchant's catalogue for which the transaction serves as a payment.`,
      )
      .optional(),
    vat_rates: z
      .array(z.record(z.unknown()))
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
                "PENDING",
                "SCHEDULED",
                "FAILED",
                "REFUNDED",
                "SUCCESSFUL",
                "PAID_OUT",
              ])
              .describe(`Status of the transaction event.`)
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
          .describe(`Details of a transaction event.`),
      )
      .describe(`List of transaction events related to the transaction.`)
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
      ])
      .describe(
        `Status generated from the processing status and the latest transaction state.`,
      )
      .optional(),
    links: z
      .array(
        z.union([
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
            })
            .describe(`Details of a link to a related resource.`),
          z.object({
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
          }),
        ]),
      )
      .describe(`List of hyperlinks for accessing related resources.`)
      .optional(),
    events: z
      .array(
        z.object({
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
              "PENDING",
              "SCHEDULED",
              "FAILED",
              "REFUNDED",
              "SUCCESSFUL",
              "PAID_OUT",
            ])
            .describe(`Status of the transaction event.`)
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
        }),
      )
      .describe(`List of events related to the transaction.`)
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
  .passthrough()
  .describe(`OK`);

export const listTransactionsV2_1Parameters = z.object({
  merchantCode: z.string(),
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
  users: z
    .array(z.string())
    .optional()
    .describe(`Filters the returned results by user email.`),
  statuses: z
    .array(
      z.enum(["SUCCESSFUL", "CANCELLED", "FAILED", "REFUNDED", "CHARGE_BACK"]),
    )
    .optional()
    .describe(
      `Filters the returned results by the specified list of final statuses of the transactions.`,
    ),
  payment_types: z
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
        .describe(`Entry mode value accepted by the \`entry_modes[]\` filter.`),
    )
    .optional()
    .describe(
      `Filters the returned results by the specified list of entry modes.`,
    ),
  types: z
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
        z.object({
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
            .enum(["SUCCESSFUL", "CANCELLED", "FAILED", "PENDING"])
            .describe(`Current status of the transaction.`)
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
        }),
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
          })
          .describe(`Details of a link to a related resource.`),
      )
      .optional(),
  })
  .passthrough()
  .describe(`OK`);

export const refundTransactionParameters = z
  .object({
    txnId: z.string().describe(`Unique ID of the transaction.`),
    amount: z
      .number()
      .describe(
        `Amount to be refunded. Eligible amount can't exceed the amount of the transaction and varies based on country and currency. If you do not specify a value, the system performs a full refund of the transaction.`,
      )
      .optional(),
  })
  .describe(`Optional amount for partial refunds of transactions.`);

export const refundTransactionResult = z.any();
