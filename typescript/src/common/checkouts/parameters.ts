import { z } from "zod";

export const createCheckoutParameters = z
  .object({
    checkout_reference: z
      .string()
      .max(64)
      .describe(
        `Merchant-defined reference for the new checkout, up to 64 characters. Use it to correlate the checkout with an order or payment attempt in your own system. If a checkout already exists for the supplied unique parameters, creation returns \`409\` with \`DUPLICATED_CHECKOUT\`; see the conflict response.`,
      ),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      ),
    merchant_code: z
      .string()
      .describe(
        `Short unique identifier for the merchant that should receive the payment.`,
      ),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting for easier identification of the checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Merchant-scoped customer identifier. Required when setting up recurring payments and useful when the checkout should be linked to a returning payer.`,
      )
      .optional(),
    purpose: z
      .enum(["CHECKOUT", "SETUP_RECURRING_PAYMENT"])
      .describe(
        `Business purpose of the checkout. Use \`CHECKOUT\` for a standard payment and \`SETUP_RECURRING_PAYMENT\` when collecting consent and payment details for future recurring charges.`,
      )
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
      )
      .optional(),
    redirect_url: z
      .string()
      .describe(
        `URL where the payer should be sent after a redirect-based payment or SCA flow completes. This is required for [APMs](https://developer.sumup.com/online-payments/apm/introduction) and recommended for card checkouts that may require [3DS](https://developer.sumup.com/online-payments/features/3ds). If it is omitted, the [Payment Widget](https://developer.sumup.com/online-payments/checkouts) can render the challenge in an iframe instead of using a full-page redirect.`,
      )
      .optional(),
    hosted_checkout: z
      .object({
        enabled: z
          .boolean()
          .describe(
            `Whether the checkout should include a SumUp-hosted payment page.`,
          ),
      })
      .describe(
        `Hosted Checkout configuration. Enable it to receive a SumUp-hosted payment page URL in the checkout response.`,
      )
      .optional(),
  })
  .describe(
    `Request body for creating a checkout before processing payment. Define the payment amount, currency, merchant, and optional customer or redirect behavior here.`,
  );

export const createCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(64)
      .describe(
        `Merchant-defined reference for the checkout. Use it to correlate the SumUp checkout with your own order, cart, subscription, or payment attempt in your systems.`,
      )
      .optional(),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`)
      .optional(),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      )
      .optional(),
    merchant_code: z
      .string()
      .describe(
        `Short unique identifier for the merchant that receives the payment.`,
      )
      .optional(),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting. Use it to make the checkout easier to recognize in dashboards, support workflows, and reconciliation.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
      )
      .optional(),
    id: z
      .string()
      .describe(`Unique SumUp identifier of the checkout resource.`)
      .optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(
        `Current high-level state of the checkout. \`PENDING\` means the checkout exists but is not yet completed, \`PAID\` means a payment succeeded, \`FAILED\` means the latest processing attempt failed, and \`EXPIRED\` means the checkout can no longer be processed.`,
      )
      .optional(),
    date: z
      .string()
      .describe(`The timestamp of when the checkout was created.`)
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Merchant-scoped identifier of the customer associated with the checkout. Use it when storing payment instruments or reusing saved customer context for recurring and returning-payer flows.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z
          .string()
          .describe(
            `Type of mandate stored for the checkout or payment instrument.`,
          )
          .optional(),
        status: z
          .enum(["active", "inactive"])
          .describe(`Current lifecycle status of the mandate.`)
          .optional(),
        merchant_code: z
          .string()
          .describe(
            `Short unique identifier for the merchant for which the mandate is valid.`,
          )
          .optional(),
      })
      .describe(
        `Details of the mandate linked to the saved payment instrument.`,
      )
      .optional(),
    hosted_checkout_url: z
      .string()
      .describe(
        `URL of the SumUp-hosted payment page that handles the payment flow. Returned when Hosted Checkout is enabled for the checkout.`,
      )
      .optional(),
    transactions: z
      .array(
        z.object({
          id: z
            .string()
            .describe(`Unique identifier of the transaction.`)
            .optional(),
          transaction_code: z
            .string()
            .describe(
              `SumUp transaction code, for example \`TEENSK4W2K\`. Use it to look up the transaction with the \`transaction_code\` query parameter. This is separate from the transaction's \`id\` and the card issuer's \`auth_code\`.`,
            )
            .optional(),
          amount: z
            .number()
            .describe(
              `Total amount of the transaction in major units of \`currency\`, for example \`10.1\` for EUR 10.10.`,
            )
            .optional(),
          currency: z
            .enum([
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
              `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
            )
            .optional(),
          timestamp: z
            .string()
            .describe(`The timestamp of when the transaction was created.`)
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
            .describe(
              `Payment category recorded on a transaction, for example \`POS\` for a point-of-sale card payment, \`ECOM\` for an online card payment, or \`RECURRING\` for a recurring card payment. These reporting values are separate from the lowercase \`payment_type\` values used to process checkouts.`,
            )
            .optional(),
          installments_count: z
            .number()
            .int()
            .describe(`Number of installments for a deferred payment.`)
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
              `VAT included in the total transaction amount, in major units of the transaction's currency.`,
            )
            .optional(),
          tip_amount: z
            .number()
            .describe(
              `Tip included in the total transaction amount, in major units of the transaction's currency.`,
            )
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
            .describe(
              `How the payment details were captured, for example \`CHIP\` or \`CONTACTLESS\` for card-present payments and \`CUSTOMER_ENTRY\` for card details entered by the payer. For wallet and alternative payment methods, this can identify the method, such as \`APPLE_PAY\` or \`BLIK\`.`,
            )
            .optional(),
          auth_code: z
            .string()
            .describe(
              `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
            )
            .optional(),
        }),
      )
      .describe(
        `Payment attempts and resulting transaction records linked to this checkout. Use the Transactions endpoints when you need the authoritative payment result and event history.`,
      )
      .optional(),
  })
  .loose()
  .describe(
    `Core checkout resource returned by the Checkouts API. A checkout is created before payment processing and then updated as payment attempts, redirects, and resulting transactions are attached to it.`,
  );

export const deactivateCheckoutParameters = z.object({
  checkoutId: z
    .string()
    .describe(
      `SumUp-generated \`id\` returned when creating a checkout. Use this value to retrieve, update, process, or deactivate the checkout.`,
    ),
});

export const deactivateCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(64)
      .describe(
        `Merchant-defined reference for the checkout. Use it to correlate the SumUp checkout with your own order, cart, subscription, or payment attempt in your systems.`,
      )
      .optional(),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`)
      .optional(),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      )
      .optional(),
    merchant_code: z
      .string()
      .describe(
        `Short unique identifier for the merchant that receives the payment.`,
      )
      .optional(),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting. Use it to make the checkout easier to recognize in dashboards, support workflows, and reconciliation.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
      )
      .optional(),
    id: z
      .string()
      .describe(`Unique SumUp identifier of the checkout resource.`)
      .optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(
        `Current high-level state of the checkout. \`PENDING\` means the checkout exists but is not yet completed, \`PAID\` means a payment succeeded, \`FAILED\` means the latest processing attempt failed, and \`EXPIRED\` means the checkout can no longer be processed.`,
      )
      .optional(),
    date: z
      .string()
      .describe(`The timestamp of when the checkout was created.`)
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Merchant-scoped identifier of the customer associated with the checkout. Use it when storing payment instruments or reusing saved customer context for recurring and returning-payer flows.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z
          .string()
          .describe(
            `Type of mandate stored for the checkout or payment instrument.`,
          )
          .optional(),
        status: z
          .enum(["active", "inactive"])
          .describe(`Current lifecycle status of the mandate.`)
          .optional(),
        merchant_code: z
          .string()
          .describe(
            `Short unique identifier for the merchant for which the mandate is valid.`,
          )
          .optional(),
      })
      .describe(
        `Details of the mandate linked to the saved payment instrument.`,
      )
      .optional(),
    hosted_checkout_url: z
      .string()
      .describe(
        `URL of the SumUp-hosted payment page that handles the payment flow. Returned when Hosted Checkout is enabled for the checkout.`,
      )
      .optional(),
    transactions: z
      .array(
        z.object({
          id: z
            .string()
            .describe(`Unique identifier of the transaction.`)
            .optional(),
          transaction_code: z
            .string()
            .describe(
              `SumUp transaction code, for example \`TEENSK4W2K\`. Use it to look up the transaction with the \`transaction_code\` query parameter. This is separate from the transaction's \`id\` and the card issuer's \`auth_code\`.`,
            )
            .optional(),
          amount: z
            .number()
            .describe(
              `Total amount of the transaction in major units of \`currency\`, for example \`10.1\` for EUR 10.10.`,
            )
            .optional(),
          currency: z
            .enum([
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
              `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
            )
            .optional(),
          timestamp: z
            .string()
            .describe(`The timestamp of when the transaction was created.`)
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
            .describe(
              `Payment category recorded on a transaction, for example \`POS\` for a point-of-sale card payment, \`ECOM\` for an online card payment, or \`RECURRING\` for a recurring card payment. These reporting values are separate from the lowercase \`payment_type\` values used to process checkouts.`,
            )
            .optional(),
          installments_count: z
            .number()
            .int()
            .describe(`Number of installments for a deferred payment.`)
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
              `VAT included in the total transaction amount, in major units of the transaction's currency.`,
            )
            .optional(),
          tip_amount: z
            .number()
            .describe(
              `Tip included in the total transaction amount, in major units of the transaction's currency.`,
            )
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
            .describe(
              `How the payment details were captured, for example \`CHIP\` or \`CONTACTLESS\` for card-present payments and \`CUSTOMER_ENTRY\` for card details entered by the payer. For wallet and alternative payment methods, this can identify the method, such as \`APPLE_PAY\` or \`BLIK\`.`,
            )
            .optional(),
          auth_code: z
            .string()
            .describe(
              `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
            )
            .optional(),
        }),
      )
      .describe(
        `Payment attempts and resulting transaction records linked to this checkout. Use the Transactions endpoints when you need the authoritative payment result and event history.`,
      )
      .optional(),
  })
  .loose()
  .describe(
    `Core checkout resource returned by the Checkouts API. A checkout is created before payment processing and then updated as payment attempts, redirects, and resulting transactions are attached to it.`,
  );

export const getCheckoutParameters = z.object({
  checkoutId: z
    .string()
    .describe(
      `SumUp-generated \`id\` returned when creating a checkout. Use this value to retrieve, update, process, or deactivate the checkout.`,
    ),
});

export const getCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(64)
      .describe(
        `Merchant-defined reference for the checkout. Use it to correlate the SumUp checkout with your own order, cart, subscription, or payment attempt in your systems.`,
      )
      .optional(),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`)
      .optional(),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      )
      .optional(),
    merchant_code: z
      .string()
      .describe(
        `Short unique identifier for the merchant that receives the payment.`,
      )
      .optional(),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting. Use it to make the checkout easier to recognize in dashboards, support workflows, and reconciliation.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
      )
      .optional(),
    id: z
      .string()
      .describe(`Unique SumUp identifier of the checkout resource.`)
      .optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(
        `Current high-level state of the checkout. \`PENDING\` means the checkout exists but is not yet completed, \`PAID\` means a payment succeeded, \`FAILED\` means the latest processing attempt failed, and \`EXPIRED\` means the checkout can no longer be processed.`,
      )
      .optional(),
    date: z
      .string()
      .describe(`The timestamp of when the checkout was created.`)
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Merchant-scoped identifier of the customer associated with the checkout. Use it when storing payment instruments or reusing saved customer context for recurring and returning-payer flows.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z
          .string()
          .describe(
            `Type of mandate stored for the checkout or payment instrument.`,
          )
          .optional(),
        status: z
          .enum(["active", "inactive"])
          .describe(`Current lifecycle status of the mandate.`)
          .optional(),
        merchant_code: z
          .string()
          .describe(
            `Short unique identifier for the merchant for which the mandate is valid.`,
          )
          .optional(),
      })
      .describe(
        `Details of the mandate linked to the saved payment instrument.`,
      )
      .optional(),
    hosted_checkout_url: z
      .string()
      .describe(
        `URL of the SumUp-hosted payment page that handles the payment flow. Returned when Hosted Checkout is enabled for the checkout.`,
      )
      .optional(),
    transactions: z
      .array(
        z.object({
          id: z
            .string()
            .describe(`Unique identifier of the transaction.`)
            .optional(),
          transaction_code: z
            .string()
            .describe(
              `SumUp transaction code, for example \`TEENSK4W2K\`. Use it to look up the transaction with the \`transaction_code\` query parameter. This is separate from the transaction's \`id\` and the card issuer's \`auth_code\`.`,
            )
            .optional(),
          amount: z
            .number()
            .describe(
              `Total amount of the transaction in major units of \`currency\`, for example \`10.1\` for EUR 10.10.`,
            )
            .optional(),
          currency: z
            .enum([
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
              `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
            )
            .optional(),
          timestamp: z
            .string()
            .describe(`The timestamp of when the transaction was created.`)
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
            .describe(
              `Payment category recorded on a transaction, for example \`POS\` for a point-of-sale card payment, \`ECOM\` for an online card payment, or \`RECURRING\` for a recurring card payment. These reporting values are separate from the lowercase \`payment_type\` values used to process checkouts.`,
            )
            .optional(),
          installments_count: z
            .number()
            .int()
            .describe(`Number of installments for a deferred payment.`)
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
              `VAT included in the total transaction amount, in major units of the transaction's currency.`,
            )
            .optional(),
          tip_amount: z
            .number()
            .describe(
              `Tip included in the total transaction amount, in major units of the transaction's currency.`,
            )
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
            .describe(
              `How the payment details were captured, for example \`CHIP\` or \`CONTACTLESS\` for card-present payments and \`CUSTOMER_ENTRY\` for card details entered by the payer. For wallet and alternative payment methods, this can identify the method, such as \`APPLE_PAY\` or \`BLIK\`.`,
            )
            .optional(),
          auth_code: z
            .string()
            .describe(
              `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
            )
            .optional(),
        }),
      )
      .describe(
        `Payment attempts and resulting transaction records linked to this checkout. Use the Transactions endpoints when you need the authoritative payment result and event history.`,
      )
      .optional(),
    transaction_code: z
      .string()
      .describe(
        `Transaction code of the successful transaction with which the payment for the checkout is completed.`,
      )
      .optional(),
    transaction_id: z
      .string()
      .describe(
        `Unique identifier of the successful transaction that completed payment for the checkout.`,
      )
      .optional(),
    merchant_name: z.string().describe(`Name of the merchant.`).optional(),
    redirect_url: z
      .string()
      .describe(
        `URL where the payer is redirected after a redirect-based payment or SCA flow completes.`,
      )
      .optional(),
    payment_instrument: z
      .object({
        token: z
          .string()
          .describe(`Unique token of the saved payment instrument.`)
          .optional(),
      })
      .describe(
        `Details of the saved payment instrument created or reused during checkout processing.`,
      )
      .optional(),
  })
  .loose()
  .describe(
    `Checkout resource returned after a synchronous processing attempt. In addition to the base checkout fields, it can include the resulting transaction identifiers and any newly created payment instrument token.`,
  );

export const listCheckoutsParameters = z.object({
  checkout_reference: z
    .string()
    .describe(
      `Filters checkouts by the merchant-defined \`checkout_reference\` supplied when creating the checkout. This is separate from the SumUp-generated checkout \`id\`.`,
    ),
});

export const listCheckoutsResult = z
  .array(
    z
      .object({
        checkout_reference: z
          .string()
          .max(64)
          .describe(
            `Merchant-defined reference for the checkout. Use it to correlate the SumUp checkout with your own order, cart, subscription, or payment attempt in your systems.`,
          )
          .optional(),
        amount: z
          .number()
          .describe(
            `Amount to be charged to the payer, expressed in major units.`,
          )
          .optional(),
        currency: z
          .enum([
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
            `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
          )
          .optional(),
        merchant_code: z
          .string()
          .describe(
            `Short unique identifier for the merchant that receives the payment.`,
          )
          .optional(),
        description: z
          .string()
          .describe(
            `Short merchant-defined description shown in SumUp tools and reporting. Use it to make the checkout easier to recognize in dashboards, support workflows, and reconciliation.`,
          )
          .optional(),
        return_url: z
          .string()
          .describe(
            `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
          )
          .optional(),
        id: z
          .string()
          .describe(`Unique SumUp identifier of the checkout resource.`)
          .optional(),
        status: z
          .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
          .describe(
            `Current high-level state of the checkout. \`PENDING\` means the checkout exists but is not yet completed, \`PAID\` means a payment succeeded, \`FAILED\` means the latest processing attempt failed, and \`EXPIRED\` means the checkout can no longer be processed.`,
          )
          .optional(),
        date: z
          .string()
          .describe(`The timestamp of when the checkout was created.`)
          .optional(),
        valid_until: z
          .string()
          .nullable()
          .describe(
            `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
          )
          .optional(),
        customer_id: z
          .string()
          .describe(
            `Merchant-scoped identifier of the customer associated with the checkout. Use it when storing payment instruments or reusing saved customer context for recurring and returning-payer flows.`,
          )
          .optional(),
        mandate: z
          .object({
            type: z
              .string()
              .describe(
                `Type of mandate stored for the checkout or payment instrument.`,
              )
              .optional(),
            status: z
              .enum(["active", "inactive"])
              .describe(`Current lifecycle status of the mandate.`)
              .optional(),
            merchant_code: z
              .string()
              .describe(
                `Short unique identifier for the merchant for which the mandate is valid.`,
              )
              .optional(),
          })
          .describe(
            `Details of the mandate linked to the saved payment instrument.`,
          )
          .optional(),
        hosted_checkout_url: z
          .string()
          .describe(
            `URL of the SumUp-hosted payment page that handles the payment flow. Returned when Hosted Checkout is enabled for the checkout.`,
          )
          .optional(),
        transactions: z
          .array(
            z.object({
              id: z
                .string()
                .describe(`Unique identifier of the transaction.`)
                .optional(),
              transaction_code: z
                .string()
                .describe(
                  `SumUp transaction code, for example \`TEENSK4W2K\`. Use it to look up the transaction with the \`transaction_code\` query parameter. This is separate from the transaction's \`id\` and the card issuer's \`auth_code\`.`,
                )
                .optional(),
              amount: z
                .number()
                .describe(
                  `Total amount of the transaction in major units of \`currency\`, for example \`10.1\` for EUR 10.10.`,
                )
                .optional(),
              currency: z
                .enum([
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
                  `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
                )
                .optional(),
              timestamp: z
                .string()
                .describe(`The timestamp of when the transaction was created.`)
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
                .describe(
                  `Payment category recorded on a transaction, for example \`POS\` for a point-of-sale card payment, \`ECOM\` for an online card payment, or \`RECURRING\` for a recurring card payment. These reporting values are separate from the lowercase \`payment_type\` values used to process checkouts.`,
                )
                .optional(),
              installments_count: z
                .number()
                .int()
                .describe(`Number of installments for a deferred payment.`)
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
                  `VAT included in the total transaction amount, in major units of the transaction's currency.`,
                )
                .optional(),
              tip_amount: z
                .number()
                .describe(
                  `Tip included in the total transaction amount, in major units of the transaction's currency.`,
                )
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
                .describe(
                  `How the payment details were captured, for example \`CHIP\` or \`CONTACTLESS\` for card-present payments and \`CUSTOMER_ENTRY\` for card details entered by the payer. For wallet and alternative payment methods, this can identify the method, such as \`APPLE_PAY\` or \`BLIK\`.`,
                )
                .optional(),
              auth_code: z
                .string()
                .describe(
                  `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
                )
                .optional(),
            }),
          )
          .describe(
            `Payment attempts and resulting transaction records linked to this checkout. Use the Transactions endpoints when you need the authoritative payment result and event history.`,
          )
          .optional(),
        transaction_code: z
          .string()
          .describe(
            `Transaction code of the successful transaction with which the payment for the checkout is completed.`,
          )
          .optional(),
        transaction_id: z
          .string()
          .describe(
            `Unique identifier of the successful transaction that completed payment for the checkout.`,
          )
          .optional(),
        merchant_name: z.string().describe(`Name of the merchant.`).optional(),
        redirect_url: z
          .string()
          .describe(
            `URL where the payer is redirected after a redirect-based payment or SCA flow completes.`,
          )
          .optional(),
        payment_instrument: z
          .object({
            token: z
              .string()
              .describe(`Unique token of the saved payment instrument.`)
              .optional(),
          })
          .describe(
            `Details of the saved payment instrument created or reused during checkout processing.`,
          )
          .optional(),
      })
      .describe(
        `Checkout resource returned after a synchronous processing attempt. In addition to the base checkout fields, it can include the resulting transaction identifiers and any newly created payment instrument token.`,
      ),
  )
  .describe(`Returns a list of checkout resources.`);

export const updateCheckoutParameters = z
  .object({
    checkoutId: z
      .string()
      .describe(
        `SumUp-generated \`id\` returned when creating a checkout. Use this value to retrieve, update, process, or deactivate the checkout.`,
      ),
    amount: z
      .number()
      .describe(
        `Updated amount to be charged to the payer, expressed in major units.`,
      )
      .optional(),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      )
      .optional(),
    description: z
      .string()
      .describe(
        `Updated short merchant-defined description shown in SumUp tools and reporting.`,
      )
      .optional(),
    checkout_reference: z
      .string()
      .max(64)
      .describe(`Updated merchant-defined reference for the checkout.`)
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Updated expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Updated merchant-scoped customer identifier associated with the checkout.`,
      )
      .optional(),
  })
  .describe(
    `Request body for updating an existing checkout. Include only the fields that should be changed.`,
  );

export const updateCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(64)
      .describe(
        `Merchant-defined reference for the checkout. Use it to correlate the SumUp checkout with your own order, cart, subscription, or payment attempt in your systems.`,
      )
      .optional(),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`)
      .optional(),
    currency: z
      .enum([
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
        `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
      )
      .optional(),
    merchant_code: z
      .string()
      .describe(
        `Short unique identifier for the merchant that receives the payment.`,
      )
      .optional(),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting. Use it to make the checkout easier to recognize in dashboards, support workflows, and reconciliation.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL for checkout status notifications. SumUp sends an HTTP POST with \`event_type\` and the checkout \`id\`. Retrieve the checkout to verify its current status before updating your order. See the [webhook guide](https://developer.sumup.com/online-payments/webhooks/) for the payload and response requirements.`,
      )
      .optional(),
    id: z
      .string()
      .describe(`Unique SumUp identifier of the checkout resource.`)
      .optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(
        `Current high-level state of the checkout. \`PENDING\` means the checkout exists but is not yet completed, \`PAID\` means a payment succeeded, \`FAILED\` means the latest processing attempt failed, and \`EXPIRED\` means the checkout can no longer be processed.`,
      )
      .optional(),
    date: z
      .string()
      .describe(`The timestamp of when the checkout was created.`)
      .optional(),
    valid_until: z
      .string()
      .nullable()
      .describe(
        `Optional expiration timestamp. The checkout must be processed before this moment, otherwise it becomes unusable. If omitted, the checkout does not have an explicit expiry time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Merchant-scoped identifier of the customer associated with the checkout. Use it when storing payment instruments or reusing saved customer context for recurring and returning-payer flows.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z
          .string()
          .describe(
            `Type of mandate stored for the checkout or payment instrument.`,
          )
          .optional(),
        status: z
          .enum(["active", "inactive"])
          .describe(`Current lifecycle status of the mandate.`)
          .optional(),
        merchant_code: z
          .string()
          .describe(
            `Short unique identifier for the merchant for which the mandate is valid.`,
          )
          .optional(),
      })
      .describe(
        `Details of the mandate linked to the saved payment instrument.`,
      )
      .optional(),
    hosted_checkout_url: z
      .string()
      .describe(
        `URL of the SumUp-hosted payment page that handles the payment flow. Returned when Hosted Checkout is enabled for the checkout.`,
      )
      .optional(),
    transactions: z
      .array(
        z.object({
          id: z
            .string()
            .describe(`Unique identifier of the transaction.`)
            .optional(),
          transaction_code: z
            .string()
            .describe(
              `SumUp transaction code, for example \`TEENSK4W2K\`. Use it to look up the transaction with the \`transaction_code\` query parameter. This is separate from the transaction's \`id\` and the card issuer's \`auth_code\`.`,
            )
            .optional(),
          amount: z
            .number()
            .describe(
              `Total amount of the transaction in major units of \`currency\`, for example \`10.1\` for EUR 10.10.`,
            )
            .optional(),
          currency: z
            .enum([
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
              `Three-letter [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code of the amount.`,
            )
            .optional(),
          timestamp: z
            .string()
            .describe(`The timestamp of when the transaction was created.`)
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
            .describe(
              `Payment category recorded on a transaction, for example \`POS\` for a point-of-sale card payment, \`ECOM\` for an online card payment, or \`RECURRING\` for a recurring card payment. These reporting values are separate from the lowercase \`payment_type\` values used to process checkouts.`,
            )
            .optional(),
          installments_count: z
            .number()
            .int()
            .describe(`Number of installments for a deferred payment.`)
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
              `VAT included in the total transaction amount, in major units of the transaction's currency.`,
            )
            .optional(),
          tip_amount: z
            .number()
            .describe(
              `Tip included in the total transaction amount, in major units of the transaction's currency.`,
            )
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
            .describe(
              `How the payment details were captured, for example \`CHIP\` or \`CONTACTLESS\` for card-present payments and \`CUSTOMER_ENTRY\` for card details entered by the payer. For wallet and alternative payment methods, this can identify the method, such as \`APPLE_PAY\` or \`BLIK\`.`,
            )
            .optional(),
          auth_code: z
            .string()
            .describe(
              `Authorization code for the transaction sent by the payment card issuer or bank. Applicable only to card payments.`,
            )
            .optional(),
        }),
      )
      .describe(
        `Payment attempts and resulting transaction records linked to this checkout. Use the Transactions endpoints when you need the authoritative payment result and event history.`,
      )
      .optional(),
  })
  .loose()
  .describe(
    `Core checkout resource returned by the Checkouts API. A checkout is created before payment processing and then updated as payment attempts, redirects, and resulting transactions are attached to it.`,
  );
