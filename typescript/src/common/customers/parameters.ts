import { z } from "zod";

export const createCustomerParameters = z.object({
  customer_id: z.string().describe(`Unique ID of the customer.`),
  personal_details: z
    .object({
      first_name: z.string().describe(`First name of the customer.`).optional(),
      last_name: z.string().describe(`Last name of the customer.`).optional(),
      email: z.string().describe(`Email address of the customer.`).optional(),
      phone: z.string().describe(`Phone number of the customer.`).optional(),
      birth_date: z
        .string()
        .describe(`Date of birth of the customer.`)
        .optional(),
      tax_id: z
        .string()
        .max(255)
        .describe(`An identification number user for tax purposes (e.g. CPF)`)
        .optional(),
      address: z
        .object({
          city: z.string().describe(`City name from the address.`).optional(),
          country: z
            .string()
            .describe(
              `Two letter country code formatted according to [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).`,
            )
            .optional(),
          line_1: z
            .string()
            .describe(
              `First line of the address with details of the street name and number.`,
            )
            .optional(),
          line_2: z
            .string()
            .describe(
              `Second line of the address with details of the building, unit, apartment, and floor numbers.`,
            )
            .optional(),
          postal_code: z
            .string()
            .describe(`Postal code from the address.`)
            .optional(),
          state: z
            .string()
            .describe(`State name or abbreviation from the address.`)
            .optional(),
        })
        .describe(`Profile's personal address information.`)
        .optional(),
    })
    .describe(`Personal details for the customer.`)
    .optional(),
});

export const createCustomerResult = z
  .object({
    customer_id: z.string().describe(`Unique ID of the customer.`),
    personal_details: z
      .object({
        first_name: z
          .string()
          .describe(`First name of the customer.`)
          .optional(),
        last_name: z.string().describe(`Last name of the customer.`).optional(),
        email: z.string().describe(`Email address of the customer.`).optional(),
        phone: z.string().describe(`Phone number of the customer.`).optional(),
        birth_date: z
          .string()
          .describe(`Date of birth of the customer.`)
          .optional(),
        tax_id: z
          .string()
          .max(255)
          .describe(`An identification number user for tax purposes (e.g. CPF)`)
          .optional(),
        address: z
          .object({
            city: z.string().describe(`City name from the address.`).optional(),
            country: z
              .string()
              .describe(
                `Two letter country code formatted according to [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).`,
              )
              .optional(),
            line_1: z
              .string()
              .describe(
                `First line of the address with details of the street name and number.`,
              )
              .optional(),
            line_2: z
              .string()
              .describe(
                `Second line of the address with details of the building, unit, apartment, and floor numbers.`,
              )
              .optional(),
            postal_code: z
              .string()
              .describe(`Postal code from the address.`)
              .optional(),
            state: z
              .string()
              .describe(`State name or abbreviation from the address.`)
              .optional(),
          })
          .describe(`Profile's personal address information.`)
          .optional(),
      })
      .describe(`Personal details for the customer.`)
      .optional(),
  })
  .passthrough()
  .describe(`Created`);

export const deactivatePaymentInstrumentParameters = z.object({
  customerId: z.string().describe(`Unique ID of the saved customer resource.`),
  token: z
    .string()
    .describe(
      `Unique token identifying the card saved as a payment instrument resource.`,
    ),
});

export const deactivatePaymentInstrumentResult = z.any();

export const getCustomerParameters = z.object({
  customerId: z.string().describe(`Unique ID of the saved customer resource.`),
});

export const getCustomerResult = z
  .object({
    customer_id: z.string().describe(`Unique ID of the customer.`),
    personal_details: z
      .object({
        first_name: z
          .string()
          .describe(`First name of the customer.`)
          .optional(),
        last_name: z.string().describe(`Last name of the customer.`).optional(),
        email: z.string().describe(`Email address of the customer.`).optional(),
        phone: z.string().describe(`Phone number of the customer.`).optional(),
        birth_date: z
          .string()
          .describe(`Date of birth of the customer.`)
          .optional(),
        tax_id: z
          .string()
          .max(255)
          .describe(`An identification number user for tax purposes (e.g. CPF)`)
          .optional(),
        address: z
          .object({
            city: z.string().describe(`City name from the address.`).optional(),
            country: z
              .string()
              .describe(
                `Two letter country code formatted according to [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).`,
              )
              .optional(),
            line_1: z
              .string()
              .describe(
                `First line of the address with details of the street name and number.`,
              )
              .optional(),
            line_2: z
              .string()
              .describe(
                `Second line of the address with details of the building, unit, apartment, and floor numbers.`,
              )
              .optional(),
            postal_code: z
              .string()
              .describe(`Postal code from the address.`)
              .optional(),
            state: z
              .string()
              .describe(`State name or abbreviation from the address.`)
              .optional(),
          })
          .describe(`Profile's personal address information.`)
          .optional(),
      })
      .describe(`Personal details for the customer.`)
      .optional(),
  })
  .passthrough()
  .describe(`Created`);

export const listPaymentInstrumentsParameters = z.object({
  customerId: z.string().describe(`Unique ID of the saved customer resource.`),
});

export const listPaymentInstrumentsResult = z
  .array(
    z
      .object({
        token: z
          .string()
          .describe(
            `Unique token identifying the saved payment card for a customer.`,
          )
          .optional(),
        active: z
          .boolean()
          .describe(
            `Indicates whether the payment instrument is active and can be used for payments. To deactivate it, send a \`DELETE\` request to the resource endpoint.`,
          )
          .optional(),
        type: z
          .enum(["card"])
          .describe(`Type of the payment instrument.`)
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
        created_at: z
          .string()
          .describe(
            `Creation date of payment instrument. Response format expressed according to [ISO8601](https://en.wikipedia.org/wiki/ISO_8601) code.`,
          )
          .optional(),
      })
      .describe(`Payment Instrument Response`),
  )
  .describe(`OK`);

export const updateCustomerParameters = z.object({
  customerId: z.string().describe(`Unique ID of the saved customer resource.`),
  personal_details: z
    .object({
      first_name: z.string().describe(`First name of the customer.`).optional(),
      last_name: z.string().describe(`Last name of the customer.`).optional(),
      email: z.string().describe(`Email address of the customer.`).optional(),
      phone: z.string().describe(`Phone number of the customer.`).optional(),
      birth_date: z
        .string()
        .describe(`Date of birth of the customer.`)
        .optional(),
      tax_id: z
        .string()
        .max(255)
        .describe(`An identification number user for tax purposes (e.g. CPF)`)
        .optional(),
      address: z
        .object({
          city: z.string().describe(`City name from the address.`).optional(),
          country: z
            .string()
            .describe(
              `Two letter country code formatted according to [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).`,
            )
            .optional(),
          line_1: z
            .string()
            .describe(
              `First line of the address with details of the street name and number.`,
            )
            .optional(),
          line_2: z
            .string()
            .describe(
              `Second line of the address with details of the building, unit, apartment, and floor numbers.`,
            )
            .optional(),
          postal_code: z
            .string()
            .describe(`Postal code from the address.`)
            .optional(),
          state: z
            .string()
            .describe(`State name or abbreviation from the address.`)
            .optional(),
        })
        .describe(`Profile's personal address information.`)
        .optional(),
    })
    .describe(`Personal details for the customer.`)
    .optional(),
});

export const updateCustomerResult = z
  .object({
    customer_id: z.string().describe(`Unique ID of the customer.`),
    personal_details: z
      .object({
        first_name: z
          .string()
          .describe(`First name of the customer.`)
          .optional(),
        last_name: z.string().describe(`Last name of the customer.`).optional(),
        email: z.string().describe(`Email address of the customer.`).optional(),
        phone: z.string().describe(`Phone number of the customer.`).optional(),
        birth_date: z
          .string()
          .describe(`Date of birth of the customer.`)
          .optional(),
        tax_id: z
          .string()
          .max(255)
          .describe(`An identification number user for tax purposes (e.g. CPF)`)
          .optional(),
        address: z
          .object({
            city: z.string().describe(`City name from the address.`).optional(),
            country: z
              .string()
              .describe(
                `Two letter country code formatted according to [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).`,
              )
              .optional(),
            line_1: z
              .string()
              .describe(
                `First line of the address with details of the street name and number.`,
              )
              .optional(),
            line_2: z
              .string()
              .describe(
                `Second line of the address with details of the building, unit, apartment, and floor numbers.`,
              )
              .optional(),
            postal_code: z
              .string()
              .describe(`Postal code from the address.`)
              .optional(),
            state: z
              .string()
              .describe(`State name or abbreviation from the address.`)
              .optional(),
          })
          .describe(`Profile's personal address information.`)
          .optional(),
      })
      .describe(`Personal details for the customer.`)
      .optional(),
  })
  .passthrough()
  .describe(`Created`);
