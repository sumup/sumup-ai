import { z } from "zod";

export const createCheckoutParameters = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
      .describe(
        `Unique ID of the payment checkout specified by the client application when creating the checkout resource.`,
      ),
    amount: z.number().describe(`Amount of the payment.`),
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
      ),
    merchant_code: z
      .string()
      .describe(`Unique identifying code of the merchant profile.`),
    description: z
      .string()
      .describe(
        `Short description of the checkout visible in the SumUp dashboard. The description can contribute to reporting, allowing easier identification of a checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `URL to which the SumUp platform sends the processing status of the payment checkout.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Unique identification of a customer. If specified, the checkout session and payment instrument are associated with the referenced customer.`,
      )
      .optional(),
    purpose: z
      .enum(["CHECKOUT", "SETUP_RECURRING_PAYMENT"])
      .describe(`Purpose of the checkout.`)
      .optional(),
    id: z.string().describe(`Unique ID of the checkout resource.`).optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID"])
      .describe(`Current status of the checkout.`)
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
        `Date and time of the checkout expiration before which the client application needs to send a processing request. If no value is present, the checkout does not have an expiration time.`,
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
            .describe(
              `Internal unique ID of the transaction on the SumUp platform.`,
            )
            .optional(),
        }),
      )
      .describe(`List of transactions related to the payment.`)
      .optional(),
    redirect_url: z
      .string()
      .describe(
        `__Required__ for [APMs](https://developer.sumup.com/online-payments/apm/introduction) and __recommended__ for card payments. Refers to a url where the end user is redirected once the payment processing completes. If not specified, the [Payment Widget](https://developer.sumup.com/online-payments/tools/card-widget) renders [3DS challenge](https://developer.sumup.com/online-payments/features/3ds) within an iframe instead of performing a full-page redirect.`,
      )
      .optional(),
  })
  .describe(`Details of the payment checkout.`);

export const createCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
      .describe(
        `Unique ID of the payment checkout specified by the client application when creating the checkout resource.`,
      )
      .optional(),
    amount: z.number().describe(`Amount of the payment.`).optional(),
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
    merchant_code: z
      .string()
      .describe(`Unique identifying code of the merchant profile.`)
      .optional(),
    description: z
      .string()
      .describe(
        `Short description of the checkout visible in the SumUp dashboard. The description can contribute to reporting, allowing easier identification of a checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `URL to which the SumUp platform sends the processing status of the payment checkout.`,
      )
      .optional(),
    id: z.string().describe(`Unique ID of the checkout resource.`).optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(`Current status of the checkout.`)
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
        `Date and time of the checkout expiration before which the client application needs to send a processing request. If no value is present, the checkout does not have an expiration time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Unique identification of a customer. If specified, the checkout session and payment instrument are associated with the referenced customer.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z.string().describe(`Indicates the mandate type`).optional(),
        status: z.string().describe(`Mandate status`).optional(),
        merchant_code: z
          .string()
          .describe(`Merchant code which has the mandate`)
          .optional(),
      })
      .describe(`Created mandate`)
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
            .describe(
              `Internal unique ID of the transaction on the SumUp platform.`,
            )
            .optional(),
        }),
      )
      .describe(`List of transactions related to the payment.`)
      .optional(),
  })
  .passthrough()
  .describe(`Details of the payment checkout.`);

export const deactivateCheckoutParameters = z.object({
  id: z.string().describe(`Unique ID of the checkout resource.`),
});

export const deactivateCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
      .describe(
        `Unique ID of the payment checkout specified by the client application when creating the checkout resource.`,
      )
      .optional(),
    amount: z.number().describe(`Amount of the payment.`).optional(),
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
    merchant_code: z
      .string()
      .describe(`Unique identifying code of the merchant profile.`)
      .optional(),
    description: z
      .string()
      .describe(
        `Short description of the checkout visible in the SumUp dashboard. The description can contribute to reporting, allowing easier identification of a checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `URL to which the SumUp platform sends the processing status of the payment checkout.`,
      )
      .optional(),
    id: z.string().describe(`Unique ID of the checkout resource.`).optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(`Current status of the checkout.`)
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
        `Date and time of the checkout expiration before which the client application needs to send a processing request. If no value is present, the checkout does not have an expiration time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Unique identification of a customer. If specified, the checkout session and payment instrument are associated with the referenced customer.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z.string().describe(`Indicates the mandate type`).optional(),
        status: z.string().describe(`Mandate status`).optional(),
        merchant_code: z
          .string()
          .describe(`Merchant code which has the mandate`)
          .optional(),
      })
      .describe(`Created mandate`)
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
            .describe(
              `Internal unique ID of the transaction on the SumUp platform.`,
            )
            .optional(),
        }),
      )
      .describe(`List of transactions related to the payment.`)
      .optional(),
  })
  .passthrough()
  .describe(`Details of the payment checkout.`);

export const getCheckoutParameters = z.object({
  id: z.string().describe(`Unique ID of the checkout resource.`),
});

export const getCheckoutResult = z
  .object({
    checkout_reference: z
      .string()
      .max(90)
      .describe(
        `Unique ID of the payment checkout specified by the client application when creating the checkout resource.`,
      )
      .optional(),
    amount: z.number().describe(`Amount of the payment.`).optional(),
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
    merchant_code: z
      .string()
      .describe(`Unique identifying code of the merchant profile.`)
      .optional(),
    description: z
      .string()
      .describe(
        `Short description of the checkout visible in the SumUp dashboard. The description can contribute to reporting, allowing easier identification of a checkout.`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `URL to which the SumUp platform sends the processing status of the payment checkout.`,
      )
      .optional(),
    id: z.string().describe(`Unique ID of the checkout resource.`).optional(),
    status: z
      .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
      .describe(`Current status of the checkout.`)
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
        `Date and time of the checkout expiration before which the client application needs to send a processing request. If no value is present, the checkout does not have an expiration time.`,
      )
      .optional(),
    customer_id: z
      .string()
      .describe(
        `Unique identification of a customer. If specified, the checkout session and payment instrument are associated with the referenced customer.`,
      )
      .optional(),
    mandate: z
      .object({
        type: z.string().describe(`Indicates the mandate type`).optional(),
        status: z.string().describe(`Mandate status`).optional(),
        merchant_code: z
          .string()
          .describe(`Merchant code which has the mandate`)
          .optional(),
      })
      .describe(`Created mandate`)
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
            .describe(
              `Internal unique ID of the transaction on the SumUp platform.`,
            )
            .optional(),
        }),
      )
      .describe(`List of transactions related to the payment.`)
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
        `Refers to a url where the end user is redirected once the payment processing completes.`,
      )
      .optional(),
    payment_instrument: z
      .object({
        token: z.string().describe(`Token value`).optional(),
      })
      .describe(
        `Object containing token information for the specified payment instrument`,
      )
      .optional(),
  })
  .passthrough()
  .describe(`OK`);

export const getPaymentMethodsParameters = z.object({
  merchantCode: z.string().describe(`The SumUp merchant code.`),
  amount: z
    .number()
    .optional()
    .describe(
      `The amount for which the payment methods should be eligible, in major units. Note that currency must also be provided when filtering by amount.`,
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
  .passthrough()
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
    z.object({
      checkout_reference: z
        .string()
        .max(90)
        .describe(
          `Unique ID of the payment checkout specified by the client application when creating the checkout resource.`,
        )
        .optional(),
      amount: z.number().describe(`Amount of the payment.`).optional(),
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
      merchant_code: z
        .string()
        .describe(`Unique identifying code of the merchant profile.`)
        .optional(),
      description: z
        .string()
        .describe(
          `Short description of the checkout visible in the SumUp dashboard. The description can contribute to reporting, allowing easier identification of a checkout.`,
        )
        .optional(),
      return_url: z
        .string()
        .describe(
          `URL to which the SumUp platform sends the processing status of the payment checkout.`,
        )
        .optional(),
      id: z.string().describe(`Unique ID of the checkout resource.`).optional(),
      status: z
        .enum(["PENDING", "FAILED", "PAID", "EXPIRED"])
        .describe(`Current status of the checkout.`)
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
          `Date and time of the checkout expiration before which the client application needs to send a processing request. If no value is present, the checkout does not have an expiration time.`,
        )
        .optional(),
      customer_id: z
        .string()
        .describe(
          `Unique identification of a customer. If specified, the checkout session and payment instrument are associated with the referenced customer.`,
        )
        .optional(),
      mandate: z
        .object({
          type: z.string().describe(`Indicates the mandate type`).optional(),
          status: z.string().describe(`Mandate status`).optional(),
          merchant_code: z
            .string()
            .describe(`Merchant code which has the mandate`)
            .optional(),
        })
        .describe(`Created mandate`)
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
              .describe(
                `Internal unique ID of the transaction on the SumUp platform.`,
              )
              .optional(),
          }),
        )
        .describe(`List of transactions related to the payment.`)
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
          `Refers to a url where the end user is redirected once the payment processing completes.`,
        )
        .optional(),
      payment_instrument: z
        .object({
          token: z.string().describe(`Token value`).optional(),
        })
        .describe(
          `Object containing token information for the specified payment instrument`,
        )
        .optional(),
    }),
  )
  .describe(`OK`);
