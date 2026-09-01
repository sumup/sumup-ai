import { z } from "zod";

export const getReceiptParameters = z.object({
  transactionId: z
    .string()
    .describe(
      `SumUp unique transaction ID or transaction code, e.g. TS7HDYLSKD.`,
    ),
  mid: z.string().describe(`Short unique identifier for the merchant.`),
  tx_event_id: z
    .number()
    .int()
    .optional()
    .describe(
      `Unique identifier of the transaction event to include on the receipt.`,
    ),
});

export const getReceiptResult = z
  .object({
    transaction_data: z
      .object({
        transaction_code: z
          .string()
          .describe(
            `Transaction code returned after processing the transaction.`,
          )
          .optional(),
        transaction_id: z
          .string()
          .describe(`Unique identifier of the transaction.`)
          .optional(),
        merchant_code: z
          .string()
          .describe(`Short unique identifier for the merchant.`)
          .optional(),
        amount: z
          .string()
          .describe(`Total transaction amount, in major units.`)
          .optional(),
        vat_amount: z
          .string()
          .describe(`VAT included in the transaction amount, in major units.`)
          .optional(),
        tip_amount: z
          .string()
          .describe(`Tip included in the transaction amount, in major units.`)
          .optional(),
        currency: z
          .string()
          .describe(`Three-letter ISO 4217 currency code of the transaction.`)
          .optional(),
        timestamp: z
          .string()
          .describe(`The timestamp of when the transaction was created.`)
          .optional(),
        status: z
          .string()
          .describe(`Current processing status of the transaction.`)
          .optional(),
        payment_type: z
          .string()
          .describe(`Payment type used for the transaction.`)
          .optional(),
        entry_mode: z
          .string()
          .describe(`Entry mode of the payment details.`)
          .optional(),
        verification_method: z
          .string()
          .describe(`Cardholder verification method.`)
          .optional(),
        card_reader: z
          .object({
            code: z
              .string()
              .describe(`Unique identifier of the physical card reader.`)
              .optional(),
            type: z
              .string()
              .describe(`Model of the physical card reader.`)
              .optional(),
          })
          .describe(`Card reader details displayed on the receipt.`)
          .optional(),
        card: z
          .object({
            last_4_digits: z
              .string()
              .describe(`Last four digits of the payment card number.`)
              .optional(),
            type: z
              .string()
              .describe(`Issuing card network of the payment card.`)
              .optional(),
          })
          .describe(`Payment card details displayed on the receipt.`)
          .optional(),
        installments_count: z
          .number()
          .int()
          .describe(`Number of installments.`)
          .optional(),
        process_as: z
          .enum(["CREDIT", "DEBIT"])
          .describe(`Whether the transaction was processed as credit or debit.`)
          .optional(),
        products: z
          .array(
            z.object({
              name: z.string().describe(`Product name.`).optional(),
              description: z
                .string()
                .describe(`Product description.`)
                .optional(),
              price: z.string().describe(`Product price.`).optional(),
              vat_rate: z.string().describe(`VAT rate.`).optional(),
              single_vat_amount: z
                .string()
                .describe(`VAT amount for a single product.`)
                .optional(),
              price_with_vat: z
                .string()
                .describe(`Product price including VAT.`)
                .optional(),
              vat_amount: z
                .string()
                .describe(`Total VAT amount for the product quantity.`)
                .optional(),
              quantity: z
                .number()
                .int()
                .describe(`Product quantity.`)
                .optional(),
              total_price: z
                .string()
                .describe(
                  `Total price calculated as the product price multiplied by the quantity.`,
                )
                .optional(),
              total_with_vat: z
                .string()
                .describe(`Total product price including VAT.`)
                .optional(),
            }),
          )
          .describe(`Products associated with the transaction.`)
          .optional(),
        vat_rates: z
          .array(
            z.object({
              gross: z
                .number()
                .describe(`Gross amount to which the VAT rate applies.`)
                .optional(),
              net: z
                .number()
                .describe(`Net amount to which the VAT rate applies.`)
                .optional(),
              rate: z
                .number()
                .describe(`VAT rate applied to the transaction amount.`)
                .optional(),
              vat: z
                .number()
                .describe(`VAT amount included in the gross amount.`)
                .optional(),
            }),
          )
          .describe(`VAT breakdown for the transaction.`)
          .optional(),
        events: z
          .array(
            z
              .object({
                id: z
                  .number()
                  .int()
                  .describe(`Unique identifier of the transaction event.`)
                  .optional(),
                transaction_id: z
                  .string()
                  .describe(`Unique identifier of the transaction.`)
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
                amount: z
                  .string()
                  .describe(
                    `Amount associated with the transaction event, in major units.`,
                  )
                  .optional(),
                timestamp: z
                  .string()
                  .describe(
                    `The timestamp of when the transaction event occurred.`,
                  )
                  .optional(),
                receipt_no: z
                  .string()
                  .describe(`Receipt number associated with the event.`)
                  .optional(),
              })
              .describe(
                `Transaction event details as rendered on the receipt.`,
              ),
          )
          .describe(`Transaction events displayed on the receipt.`)
          .optional(),
        receipt_no: z
          .string()
          .describe(`Receipt number associated with the transaction.`)
          .optional(),
      })
      .describe(`Transaction details displayed on a receipt.`)
      .optional(),
    merchant_data: z
      .object({
        merchant_profile: z
          .object({
            merchant_code: z
              .string()
              .describe(`Short unique identifier for the merchant.`)
              .optional(),
            business_name: z
              .string()
              .describe(`Business name of the merchant.`)
              .optional(),
            company_registration_number: z
              .string()
              .describe(`Company registration number of the merchant.`)
              .optional(),
            vat_id: z
              .string()
              .describe(`VAT identification number of the merchant.`)
              .optional(),
            website: z.string().describe(`Website of the merchant.`).optional(),
            email: z
              .string()
              .describe(`Email address of the merchant.`)
              .optional(),
            language: z
              .string()
              .describe(`Language configured for the merchant profile.`)
              .optional(),
            address: z
              .object({
                address_line1: z
                  .string()
                  .describe(`First line of the merchant address.`)
                  .optional(),
                address_line2: z
                  .string()
                  .describe(`Second line of the merchant address.`)
                  .optional(),
                city: z
                  .string()
                  .describe(`City of the merchant address.`)
                  .optional(),
                country: z
                  .string()
                  .describe(
                    `Two-letter ISO 3166-1 alpha-2 country code of the merchant address.`,
                  )
                  .optional(),
                country_en_name: z
                  .string()
                  .describe(
                    `English name of the country in the merchant address.`,
                  )
                  .optional(),
                country_native_name: z
                  .string()
                  .describe(
                    `Localized name of the country in the merchant address.`,
                  )
                  .optional(),
                region_name: z
                  .string()
                  .describe(`Region or state of the merchant address.`)
                  .optional(),
                post_code: z
                  .string()
                  .describe(`Postal code of the merchant address.`)
                  .optional(),
                landline: z
                  .string()
                  .describe(`Landline phone number of the merchant.`)
                  .optional(),
              })
              .describe(`Business address of the merchant.`)
              .optional(),
          })
          .describe(`Merchant profile details displayed on the receipt.`)
          .optional(),
        locale: z
          .string()
          .describe(`Locale used for rendering localized receipt fields.`)
          .optional(),
      })
      .describe(`Merchant details displayed on a transaction receipt.`)
      .optional(),
    emv_data: z
      .object({})
      .catchall(z.unknown())
      .describe(`EMV-specific metadata returned for card-present payments.`)
      .optional(),
    acquirer_data: z
      .object({
        tid: z
          .string()
          .describe(`Identifier of the terminal used for the authorization.`)
          .optional(),
        authorization_code: z
          .string()
          .describe(`Authorization code returned by the acquirer.`)
          .optional(),
        return_code: z
          .string()
          .describe(`Return code reported by the acquirer.`)
          .optional(),
        local_time: z
          .string()
          .describe(`Local timestamp of the card authorization.`)
          .optional(),
      })
      .describe(`Acquirer-specific metadata related to the card authorization.`)
      .optional(),
  })
  .loose()
  .describe(`Receipt details for a transaction.`);
