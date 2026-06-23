import { z } from "zod";

export const createApplePaySessionParameters = z.object({
  checkoutId: z.string().describe(`Unique ID of the checkout resource.`),
  context: z.string().describe(`the context to create this apple pay session.`),
  target: z
    .string()
    .describe(`The target url to create this apple pay session.`),
});

export const createApplePaySessionResult = z
  .object({})
  .catchall(z.unknown())
  .loose()
  .describe(`Successful request. Returns the Apple Pay merchant session object
that should be forwarded to the Apple Pay JS SDK to complete merchant
validation and continue the payment flow.`);

export const createCheckoutParameters = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
      .describe(
        `Merchant-defined reference for the new checkout. It should be unique enough for you to identify the payment attempt in your own systems.`,
      ),
    amount: z
      .number()
      .describe(`Amount to be charged to the payer, expressed in major units.`),
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
      ),
    merchant_code: z
      .string()
      .describe(`Merchant account that should receive the payment.`),
    description: z
      .string()
      .describe(
        `Short merchant-defined description shown in SumUp tools and reporting for easier identification of the checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Optional backend callback URL used by SumUp to notify your platform about processing updates for the checkout.`,
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
      .max(90)
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
    merchant_code: z
      .string()
      .describe(`Merchant account that receives the payment.`)
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
        `Optional backend callback URL used by SumUp to notify your platform about processing updates for the checkout.`,
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
      .describe(
        `Date and time of the creation of the payment checkout. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
      )
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
          .describe(`Merchant account for which the mandate is valid.`)
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
            .describe(
              `Current number of the installment for deferred payments.`,
            )
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
            .describe(
              `Amount of the tip (out of the total transaction amount).`,
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
            .describe(`Entry mode of the payment details.`)
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
  checkoutId: z.string().describe(`Unique ID of the checkout resource.`),
});

export const deactivateCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
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
    merchant_code: z
      .string()
      .describe(`Merchant account that receives the payment.`)
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
        `Optional backend callback URL used by SumUp to notify your platform about processing updates for the checkout.`,
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
      .describe(
        `Date and time of the creation of the payment checkout. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
      )
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
          .describe(`Merchant account for which the mandate is valid.`)
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
            .describe(
              `Current number of the installment for deferred payments.`,
            )
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
            .describe(
              `Amount of the tip (out of the total transaction amount).`,
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
            .describe(`Entry mode of the payment details.`)
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
  checkoutId: z.string().describe(`Unique ID of the checkout resource.`),
});

export const getCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
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
    merchant_code: z
      .string()
      .describe(`Merchant account that receives the payment.`)
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
        `Optional backend callback URL used by SumUp to notify your platform about processing updates for the checkout.`,
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
      .describe(
        `Date and time of the creation of the payment checkout. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
      )
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
          .describe(`Merchant account for which the mandate is valid.`)
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
            .describe(
              `Current number of the installment for deferred payments.`,
            )
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
            .describe(
              `Amount of the tip (out of the total transaction amount).`,
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
            .describe(`Entry mode of the payment details.`)
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
        `Transaction ID of the successful transaction with which the payment for the checkout is completed.`,
      )
      .optional(),
    merchant_name: z.string().describe(`Name of the merchant`).optional(),
    redirect_url: z
      .string()
      .describe(
        `URL where the payer is redirected after a redirect-based payment or SCA flow completes.`,
      )
      .optional(),
    payment_instrument: z
      .object({
        token: z.string().describe(`Token value`).optional(),
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

export const getPaymentMethodsParameters = z.object({
  merchantCode: z.string().describe(`The SumUp merchant code.`),
  amount: z
    .number()
    .optional()
    .describe(
      `The amount for which the payment methods should be eligible, in major units.`,
    ),
  currency: z
    .string()
    .optional()
    .describe(`The currency for which the payment methods should be eligible.`),
});

export const getPaymentMethodsResult = z
  .object({
    available_payment_methods: z
      .array(
        z.object({
          id: z.string().describe(`The ID of the payment method.`),
        }),
      )
      .optional(),
  })
  .loose()
  .describe(`Available payment methods`);

export const listCheckoutsParameters = z.object({
  checkout_reference: z
    .string()
    .optional()
    .describe(
      `Filters the list of checkout resources by the unique ID of the checkout.`,
    ),
});

export const listCheckoutsResult = z
  .array(
    z
      .object({
        checkout_reference: z
          .string()
          .max(90)
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
        merchant_code: z
          .string()
          .describe(`Merchant account that receives the payment.`)
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
            `Optional backend callback URL used by SumUp to notify your platform about processing updates for the checkout.`,
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
          .describe(
            `Date and time of the creation of the payment checkout. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
          )
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
              .describe(`Merchant account for which the mandate is valid.`)
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
                .describe(`Unique ID of the transaction.`)
                .optional(),
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
                .describe(
                  `Amount of the tip (out of the total transaction amount).`,
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
                .describe(`Entry mode of the payment details.`)
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
            `Transaction ID of the successful transaction with which the payment for the checkout is completed.`,
          )
          .optional(),
        merchant_name: z.string().describe(`Name of the merchant`).optional(),
        redirect_url: z
          .string()
          .describe(
            `URL where the payer is redirected after a redirect-based payment or SCA flow completes.`,
          )
          .optional(),
        payment_instrument: z
          .object({
            token: z.string().describe(`Token value`).optional(),
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
