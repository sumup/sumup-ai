import { z } from "zod";

export const getMerchantParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  version: z
    .string()
    .optional()
    .describe(`The version of the resource. At the moment, the only supported value is \`latest\`. When provided and the requested resource's \`change_status\` is pending, the resource will be returned with all pending changes applied. When no changes are pending the resource is returned as is. The \`change_status\` in the response body will reflect the current state of the resource.
`),
});

export const getMerchantResult = z
  .object({
    merchant_code: z
      .string()
      .describe(`Short unique identifier for the merchant.`),
    organization_id: z
      .string()
      .describe(`ID of the organization the merchant belongs to (if any).`)
      .optional(),
    business_type: z
      .string()
      .describe(
        `The business type.
* \`sole_trader\`: The business is run by an self-employed individual.
* \`company\`: The business is run as a company with one or more shareholders
* \`partnership\`: The business is run as a company with two or more shareholders that can be also other legal entities
* \`non_profit\`: The business is run as a nonprofit organization that operates for public or social benefit
* \`government_entity\`: The business is state owned and operated
`,
      )
      .optional(),
    company: z
      .object({
        name: z
          .string()
          .max(512)
          .describe(`The company's legal name.`)
          .optional(),
        merchant_category_code: z
          .string()
          .describe(
            `The merchant category code for the account as specified by [ISO18245](https://www.iso.org/standard/33365.html). MCCs are used to classify businesses based on the goods or services they provide.
`,
          )
          .optional(),
        legal_type: z
          .string()
          .min(4)
          .max(64)
          .describe(
            `The unique legal type reference as defined in the country SDK. We do not rely on IDs as used by other services. Consumers of this API are expected to use the country SDK to map to any other IDs, translation keys, or descriptions.
`,
          )
          .optional(),
        address: z
          .object({
            street_address: z
              .array(
                z.string().max(100).describe(`The first line of the address.`),
              )
              .max(2)
              .optional(),
            post_code: z
              .string()
              .max(32)
              .describe(
                `The postal code (aka. zip code) of the address.
`,
              )
              .optional(),
            country: z
              .string()
              .min(2)
              .max(2)
              .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
            city: z
              .string()
              .max(512)
              .describe(
                `The city of the address.
`,
              )
              .optional(),
            province: z
              .string()
              .max(512)
              .describe(
                `The province where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            region: z
              .string()
              .max(512)
              .describe(
                `The region where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            county: z
              .string()
              .max(512)
              .describe(
                `A county is a geographic region of a country used for administrative or other purposes in some nations. Used in countries such as Ireland, Romania, etc.
`,
              )
              .optional(),
            autonomous_community: z
              .string()
              .max(512)
              .describe(
                `In Spain, an autonomous community is the first sub-national level of political and administrative division.
`,
              )
              .optional(),
            post_town: z
              .string()
              .max(512)
              .describe(
                `A post town is a required part of all postal addresses in the United Kingdom and Ireland, and a basic unit of the postal delivery system.
`,
              )
              .optional(),
            state: z
              .string()
              .max(512)
              .describe(
                `Most often, a country has a single state, with various administrative divisions. The term "state" is sometimes used to refer to the federated polities that make up the federation. Used in countries such as the United States and Brazil.
`,
              )
              .optional(),
            neighborhood: z
              .string()
              .max(512)
              .describe(
                `Locality level of the address. Used in countries such as Brazil or Chile.
`,
              )
              .optional(),
            commune: z
              .string()
              .max(512)
              .describe(
                `In many countries, terms cognate with "commune" are used, referring to the community living in the area and the common interest. Used in countries such as Chile.
`,
              )
              .optional(),
            department: z
              .string()
              .max(512)
              .describe(
                `A department (French: département, Spanish: departamento) is an administrative or political division in several countries. Used in countries such as Colombia.
`,
              )
              .optional(),
            municipality: z
              .string()
              .max(512)
              .describe(
                `A municipality is usually a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. Used in countries such as Colombia.
`,
              )
              .optional(),
            district: z
              .string()
              .max(512)
              .describe(
                `A district is a type of administrative division that in some countries is managed by the local government. Used in countries such as Portugal.
`,
              )
              .optional(),
            zip_code: z
              .string()
              .max(512)
              .describe(
                `A US system of postal codes used by the United States Postal Service (USPS).
`,
              )
              .optional(),
            eircode: z
              .string()
              .max(512)
              .describe(
                `A postal address in Ireland.
`,
              )
              .optional(),
          })
          .describe(
            `An address somewhere in the world. The address fields used depend on the country conventions. For example, in Great Britain, \`city\` is \`post_town\`. In the United States, the top-level administrative unit used in addresses is \`state\`, whereas in Chile it's \`region\`.
Whether an address is valid or not depends on whether the locally required fields are present. Fields not supported in a country will be ignored.`,
          )
          .optional(),
        trading_address: z
          .object({
            street_address: z
              .array(
                z.string().max(100).describe(`The first line of the address.`),
              )
              .max(2)
              .optional(),
            post_code: z
              .string()
              .max(32)
              .describe(
                `The postal code (aka. zip code) of the address.
`,
              )
              .optional(),
            country: z
              .string()
              .min(2)
              .max(2)
              .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
            city: z
              .string()
              .max(512)
              .describe(
                `The city of the address.
`,
              )
              .optional(),
            province: z
              .string()
              .max(512)
              .describe(
                `The province where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            region: z
              .string()
              .max(512)
              .describe(
                `The region where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            county: z
              .string()
              .max(512)
              .describe(
                `A county is a geographic region of a country used for administrative or other purposes in some nations. Used in countries such as Ireland, Romania, etc.
`,
              )
              .optional(),
            autonomous_community: z
              .string()
              .max(512)
              .describe(
                `In Spain, an autonomous community is the first sub-national level of political and administrative division.
`,
              )
              .optional(),
            post_town: z
              .string()
              .max(512)
              .describe(
                `A post town is a required part of all postal addresses in the United Kingdom and Ireland, and a basic unit of the postal delivery system.
`,
              )
              .optional(),
            state: z
              .string()
              .max(512)
              .describe(
                `Most often, a country has a single state, with various administrative divisions. The term "state" is sometimes used to refer to the federated polities that make up the federation. Used in countries such as the United States and Brazil.
`,
              )
              .optional(),
            neighborhood: z
              .string()
              .max(512)
              .describe(
                `Locality level of the address. Used in countries such as Brazil or Chile.
`,
              )
              .optional(),
            commune: z
              .string()
              .max(512)
              .describe(
                `In many countries, terms cognate with "commune" are used, referring to the community living in the area and the common interest. Used in countries such as Chile.
`,
              )
              .optional(),
            department: z
              .string()
              .max(512)
              .describe(
                `A department (French: département, Spanish: departamento) is an administrative or political division in several countries. Used in countries such as Colombia.
`,
              )
              .optional(),
            municipality: z
              .string()
              .max(512)
              .describe(
                `A municipality is usually a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. Used in countries such as Colombia.
`,
              )
              .optional(),
            district: z
              .string()
              .max(512)
              .describe(
                `A district is a type of administrative division that in some countries is managed by the local government. Used in countries such as Portugal.
`,
              )
              .optional(),
            zip_code: z
              .string()
              .max(512)
              .describe(
                `A US system of postal codes used by the United States Postal Service (USPS).
`,
              )
              .optional(),
            eircode: z
              .string()
              .max(512)
              .describe(
                `A postal address in Ireland.
`,
              )
              .optional(),
          })
          .describe(
            `An address somewhere in the world. The address fields used depend on the country conventions. For example, in Great Britain, \`city\` is \`post_town\`. In the United States, the top-level administrative unit used in addresses is \`state\`, whereas in Chile it's \`region\`.
Whether an address is valid or not depends on whether the locally required fields are present. Fields not supported in a country will be ignored.`,
          )
          .optional(),
        identifiers: z
          .array(
            z.object({
              ref: z
                .string()
                .describe(`The unique reference for the company identifier type as defined in the country SDK.
`),
              value: z
                .string()
                .max(100)
                .describe(`The company identifier value.
`),
            }),
          )
          .describe(
            `A list of country-specific company identifiers.
`,
          )
          .optional(),
        phone_number: z
          .string()
          .max(64)
          .describe(
            `A publicly available phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.
`,
          )
          .optional(),
        website: z
          .string()
          .max(255)
          .nullable()
          .describe(
            `HTTP(S) URL of the company's website.
`,
          )
          .optional(),
        attributes: z
          .object({})
          .catchall(z.unknown())
          .nullable()
          .describe(
            `Object attributes that are modifiable only by SumUp applications.`,
          )
          .optional(),
      })
      .describe(
        `Information about the company or business. This is legal information that is used for verification.
`,
      )
      .optional(),
    country: z
      .string()
      .min(2)
      .max(2)
      .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
    business_profile: z
      .object({
        name: z
          .string()
          .max(512)
          .describe(`The customer-facing business name.`)
          .optional(),
        dynamic_descriptor: z
          .string()
          .max(30)
          .describe(
            `The descriptor is the text that your customer sees on their bank account statement.
The more recognisable your descriptor is, the less risk you have of receiving disputes (e.g. chargebacks).
`,
          )
          .optional(),
        website: z
          .string()
          .max(512)
          .describe(`The business's publicly available website.`)
          .optional(),
        email: z
          .string()
          .max(256)
          .describe(`A publicly available email address.`)
          .optional(),
        phone_number: z
          .string()
          .max(64)
          .describe(
            `A publicly available phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.
`,
          )
          .optional(),
        address: z
          .object({
            street_address: z
              .array(
                z.string().max(100).describe(`The first line of the address.`),
              )
              .max(2)
              .optional(),
            post_code: z
              .string()
              .max(32)
              .describe(
                `The postal code (aka. zip code) of the address.
`,
              )
              .optional(),
            country: z
              .string()
              .min(2)
              .max(2)
              .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
            city: z
              .string()
              .max(512)
              .describe(
                `The city of the address.
`,
              )
              .optional(),
            province: z
              .string()
              .max(512)
              .describe(
                `The province where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            region: z
              .string()
              .max(512)
              .describe(
                `The region where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            county: z
              .string()
              .max(512)
              .describe(
                `A county is a geographic region of a country used for administrative or other purposes in some nations. Used in countries such as Ireland, Romania, etc.
`,
              )
              .optional(),
            autonomous_community: z
              .string()
              .max(512)
              .describe(
                `In Spain, an autonomous community is the first sub-national level of political and administrative division.
`,
              )
              .optional(),
            post_town: z
              .string()
              .max(512)
              .describe(
                `A post town is a required part of all postal addresses in the United Kingdom and Ireland, and a basic unit of the postal delivery system.
`,
              )
              .optional(),
            state: z
              .string()
              .max(512)
              .describe(
                `Most often, a country has a single state, with various administrative divisions. The term "state" is sometimes used to refer to the federated polities that make up the federation. Used in countries such as the United States and Brazil.
`,
              )
              .optional(),
            neighborhood: z
              .string()
              .max(512)
              .describe(
                `Locality level of the address. Used in countries such as Brazil or Chile.
`,
              )
              .optional(),
            commune: z
              .string()
              .max(512)
              .describe(
                `In many countries, terms cognate with "commune" are used, referring to the community living in the area and the common interest. Used in countries such as Chile.
`,
              )
              .optional(),
            department: z
              .string()
              .max(512)
              .describe(
                `A department (French: département, Spanish: departamento) is an administrative or political division in several countries. Used in countries such as Colombia.
`,
              )
              .optional(),
            municipality: z
              .string()
              .max(512)
              .describe(
                `A municipality is usually a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. Used in countries such as Colombia.
`,
              )
              .optional(),
            district: z
              .string()
              .max(512)
              .describe(
                `A district is a type of administrative division that in some countries is managed by the local government. Used in countries such as Portugal.
`,
              )
              .optional(),
            zip_code: z
              .string()
              .max(512)
              .describe(
                `A US system of postal codes used by the United States Postal Service (USPS).
`,
              )
              .optional(),
            eircode: z
              .string()
              .max(512)
              .describe(
                `A postal address in Ireland.
`,
              )
              .optional(),
          })
          .describe(
            `An address somewhere in the world. The address fields used depend on the country conventions. For example, in Great Britain, \`city\` is \`post_town\`. In the United States, the top-level administrative unit used in addresses is \`state\`, whereas in Chile it's \`region\`.
Whether an address is valid or not depends on whether the locally required fields are present. Fields not supported in a country will be ignored.`,
          )
          .optional(),
        branding: z
          .object({
            icon: z
              .string()
              .describe(
                `An icon for the merchant. Must be square.
`,
              )
              .optional(),
            logo: z
              .string()
              .describe(
                `A logo for the merchant that will be used in place of the icon and without the merchant's name next to it if there's sufficient space.
`,
              )
              .optional(),
            hero: z
              .string()
              .describe(
                `Data-URL encoded hero image for the merchant business.
`,
              )
              .optional(),
            primary_color: z
              .string()
              .describe(
                `A hex color value representing the primary branding color of this merchant (your brand color).
`,
              )
              .optional(),
            primary_color_fg: z
              .string()
              .describe(
                `A hex color value representing the color of the text displayed on branding color of this merchant.
`,
              )
              .optional(),
            secondary_color: z
              .string()
              .describe(
                `A hex color value representing the secondary branding color of this merchant (accent color used for buttons).
`,
              )
              .optional(),
            secondary_color_fg: z
              .string()
              .describe(
                `A hex color value representing the color of the text displayed on secondary branding color of this merchant.
`,
              )
              .optional(),
            background_color: z
              .string()
              .describe(
                `A hex color value representing the preferred background color of this merchant.
`,
              )
              .optional(),
          })
          .describe(
            `Settings used to apply the Merchant's branding to email receipts, invoices, checkouts, and other products.`,
          )
          .optional(),
      })
      .describe(
        `Business information about the merchant. This information will be visible to the merchant's customers.
`,
      )
      .optional(),
    avatar: z
      .string()
      .describe(
        `A user-facing small-format logo for use in dashboards and other user-facing applications. For customer-facing branding see \`merchant.business_profile.branding\`.
`,
      )
      .optional(),
    alias: z
      .string()
      .describe(
        `A user-facing name of the merchant account for use in dashboards and other user-facing applications. For customer-facing business name see \`merchant.business_profile\`.
`,
      )
      .optional(),
    default_currency: z
      .string()
      .min(3)
      .max(3)
      .describe(`Three-letter [ISO currency code](https://en.wikipedia.org/wiki/ISO_4217) representing the default currency for the account.
`),
    default_locale: z
      .string()
      .min(2)
      .max(5)
      .describe(`Merchant's default locale, represented as a BCP47 [RFC5646](https://datatracker.ietf.org/doc/html/rfc5646) language tag. This is typically an ISO 639-1 Alpha-2 [ISO639‑1](https://www.iso.org/iso-639-language-code) language code in lowercase and an ISO 3166-1 Alpha-2 [ISO3166‑1](https://www.iso.org/iso-3166-country-codes.html) country code in uppercase, separated by a dash. For example, en-US or fr-CA.
In multilingual countries this is the merchant's preferred locale out of those, that are officially spoken in the country. In a countries with a single official language this will match the official language.`),
    sandbox: z
      .boolean()
      .describe(`True if the merchant is a sandbox for testing.`)
      .optional(),
    meta: z
      .object({})
      .catchall(z.string().max(256))
      .nullable()
      .describe(
        `A set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.

**Warning**: Updating Meta will overwrite the existing data. Make sure to always include the complete JSON object.`,
      )
      .optional(),
    classic: z
      .object({
        id: z.number().int().describe(`Classic (serial) merchant ID.`),
      })
      .optional(),
    version: z
      .string()
      .describe(
        `The version of the resource. The version reflects a specific change submitted to the API via one of the \`PATCH\` endpoints.
`,
      )
      .optional(),
    change_status: z
      .string()
      .describe(
        `Reflects the status of changes submitted through the \`PATCH\` endpoints for the merchant or persons. If some changes have not been applied yet, the status will be \`pending\`. If all changes have been applied, the status \`done\`.
The status is only returned after write operations or on read endpoints when the \`version\` query parameter is provided.
`,
      )
      .optional(),
    created_at: z
      .string()
      .describe(`The date and time when the resource was created. This is a string as defined in [RFC 3339, section 5.6](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6).
`),
    updated_at: z
      .string()
      .describe(`The date and time when the resource was last updated. This is a string as defined in [RFC 3339, section 5.6](https://datatracker.ietf.org/doc/html/rfc3339#section-5.6).
`),
  })
  .passthrough()
  .describe(`Returns a Merchant for a valid identifier.`);

export const getPersonParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  personId: z.string().describe(`Person ID`),
  version: z
    .string()
    .optional()
    .describe(`The version of the resource. At the moment, the only supported value is \`latest\`. When provided and the requested resource's \`change_status\` is pending, the resource will be returned with all pending changes applied. When no changes are pending the resource is returned as is. The \`change_status\` in the response body will reflect the current state of the resource.
`),
});

export const getPersonResult = z
  .object({
    id: z
      .string()
      .describe(`The unique identifier for the person. This is a [typeid](https://github.com/sumup/typeid).
`),
    user_id: z
      .string()
      .describe(
        `A corresponding identity user ID for the person, if they have a user account.
`,
      )
      .optional(),
    birthdate: z
      .string()
      .describe(
        `The date of birth of the individual, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.
`,
      )
      .optional(),
    given_name: z
      .string()
      .max(60)
      .describe(`The first name(s) of the individual.`)
      .optional(),
    family_name: z
      .string()
      .max(60)
      .describe(`The last name(s) of the individual.`)
      .optional(),
    middle_name: z
      .string()
      .max(60)
      .describe(
        `Middle name(s) of the End-User. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.
`,
      )
      .optional(),
    phone_number: z
      .string()
      .max(64)
      .describe(
        `A publicly available phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.
`,
      )
      .optional(),
    relationships: z
      .array(
        z
          .string()
          .describe(`* \`representative\`: The person is the primary contact for SumUp and has full administrative power over the merchant account.
* \`owner\`: The person is a business owner. If this value is set, the \`ownership_percent\` should be set as well.
* \`officer\`: The person is an officer at the company.
`),
      )
      .min(1)
      .max(1)
      .describe(
        `A list of roles the person has in the merchant or towards SumUp. A merchant must have at least one person with the relationship \`representative\`.
`,
      )
      .optional(),
    ownership: z
      .object({
        share: z
          .number()
          .int()
          .describe(`The percent of ownership shares held by the person expressed in percent mille (1/100000). Only persons with the relationship \`owner\` can have ownership.
`),
      })
      .optional(),
    address: z
      .object({
        street_address: z
          .array(z.string().max(100).describe(`The first line of the address.`))
          .max(2)
          .optional(),
        post_code: z
          .string()
          .max(32)
          .describe(
            `The postal code (aka. zip code) of the address.
`,
          )
          .optional(),
        country: z
          .string()
          .min(2)
          .max(2)
          .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
        city: z
          .string()
          .max(512)
          .describe(
            `The city of the address.
`,
          )
          .optional(),
        province: z
          .string()
          .max(512)
          .describe(
            `The province where the address is located. This may not be relevant in some countries.
`,
          )
          .optional(),
        region: z
          .string()
          .max(512)
          .describe(
            `The region where the address is located. This may not be relevant in some countries.
`,
          )
          .optional(),
        county: z
          .string()
          .max(512)
          .describe(
            `A county is a geographic region of a country used for administrative or other purposes in some nations. Used in countries such as Ireland, Romania, etc.
`,
          )
          .optional(),
        autonomous_community: z
          .string()
          .max(512)
          .describe(
            `In Spain, an autonomous community is the first sub-national level of political and administrative division.
`,
          )
          .optional(),
        post_town: z
          .string()
          .max(512)
          .describe(
            `A post town is a required part of all postal addresses in the United Kingdom and Ireland, and a basic unit of the postal delivery system.
`,
          )
          .optional(),
        state: z
          .string()
          .max(512)
          .describe(
            `Most often, a country has a single state, with various administrative divisions. The term "state" is sometimes used to refer to the federated polities that make up the federation. Used in countries such as the United States and Brazil.
`,
          )
          .optional(),
        neighborhood: z
          .string()
          .max(512)
          .describe(
            `Locality level of the address. Used in countries such as Brazil or Chile.
`,
          )
          .optional(),
        commune: z
          .string()
          .max(512)
          .describe(
            `In many countries, terms cognate with "commune" are used, referring to the community living in the area and the common interest. Used in countries such as Chile.
`,
          )
          .optional(),
        department: z
          .string()
          .max(512)
          .describe(
            `A department (French: département, Spanish: departamento) is an administrative or political division in several countries. Used in countries such as Colombia.
`,
          )
          .optional(),
        municipality: z
          .string()
          .max(512)
          .describe(
            `A municipality is usually a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. Used in countries such as Colombia.
`,
          )
          .optional(),
        district: z
          .string()
          .max(512)
          .describe(
            `A district is a type of administrative division that in some countries is managed by the local government. Used in countries such as Portugal.
`,
          )
          .optional(),
        zip_code: z
          .string()
          .max(512)
          .describe(
            `A US system of postal codes used by the United States Postal Service (USPS).
`,
          )
          .optional(),
        eircode: z
          .string()
          .max(512)
          .describe(
            `A postal address in Ireland.
`,
          )
          .optional(),
      })
      .describe(
        `An address somewhere in the world. The address fields used depend on the country conventions. For example, in Great Britain, \`city\` is \`post_town\`. In the United States, the top-level administrative unit used in addresses is \`state\`, whereas in Chile it's \`region\`.
Whether an address is valid or not depends on whether the locally required fields are present. Fields not supported in a country will be ignored.`,
      )
      .optional(),
    identifiers: z
      .array(
        z.object({
          ref: z
            .string()
            .max(32)
            .describe(`The unique reference for the personal identifier type.`),
          value: z.string().max(128).describe(`The company identifier value.`),
        }),
      )
      .max(5)
      .describe(
        `A list of country-specific personal identifiers.
`,
      )
      .optional(),
    citizenship: z
      .string()
      .min(2)
      .max(2)
      .describe(
        `An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`,
      )
      .optional(),
    nationality: z
      .string()
      .nullable()
      .describe(
        `The persons nationality. May be an [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code, but legacy data may not conform to this standard.
`,
      )
      .optional(),
    country_of_residence: z
      .string()
      .min(2)
      .max(2)
      .nullable()
      .describe(
        `An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code representing the country where the person resides.
`,
      )
      .optional(),
    version: z
      .string()
      .describe(
        `The version of the resource. The version reflects a specific change submitted to the API via one of the \`PATCH\` endpoints.
`,
      )
      .optional(),
    change_status: z
      .string()
      .describe(
        `Reflects the status of changes submitted through the \`PATCH\` endpoints for the merchant or persons. If some changes have not been applied yet, the status will be \`pending\`. If all changes have been applied, the status \`done\`.
The status is only returned after write operations or on read endpoints when the \`version\` query parameter is provided.
`,
      )
      .optional(),
  })
  .passthrough()
  .describe(`Returns a Person for a valid identifier.`);

export const listPersonsParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  version: z
    .string()
    .optional()
    .describe(`The version of the resource. At the moment, the only supported value is \`latest\`. When provided and the requested resource's \`change_status\` is pending, the resource will be returned with all pending changes applied. When no changes are pending the resource is returned as is. The \`change_status\` in the response body will reflect the current state of the resource.
`),
});

export const listPersonsResult = z
  .object({
    items: z.array(
      z.object({
        id: z
          .string()
          .describe(`The unique identifier for the person. This is a [typeid](https://github.com/sumup/typeid).
`),
        user_id: z
          .string()
          .describe(
            `A corresponding identity user ID for the person, if they have a user account.
`,
          )
          .optional(),
        birthdate: z
          .string()
          .describe(
            `The date of birth of the individual, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.
`,
          )
          .optional(),
        given_name: z
          .string()
          .max(60)
          .describe(`The first name(s) of the individual.`)
          .optional(),
        family_name: z
          .string()
          .max(60)
          .describe(`The last name(s) of the individual.`)
          .optional(),
        middle_name: z
          .string()
          .max(60)
          .describe(
            `Middle name(s) of the End-User. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used.
`,
          )
          .optional(),
        phone_number: z
          .string()
          .max(64)
          .describe(
            `A publicly available phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.
`,
          )
          .optional(),
        relationships: z
          .array(
            z
              .string()
              .describe(`* \`representative\`: The person is the primary contact for SumUp and has full administrative power over the merchant account.
* \`owner\`: The person is a business owner. If this value is set, the \`ownership_percent\` should be set as well.
* \`officer\`: The person is an officer at the company.
`),
          )
          .min(1)
          .max(1)
          .describe(
            `A list of roles the person has in the merchant or towards SumUp. A merchant must have at least one person with the relationship \`representative\`.
`,
          )
          .optional(),
        ownership: z
          .object({
            share: z
              .number()
              .int()
              .describe(`The percent of ownership shares held by the person expressed in percent mille (1/100000). Only persons with the relationship \`owner\` can have ownership.
`),
          })
          .optional(),
        address: z
          .object({
            street_address: z
              .array(
                z.string().max(100).describe(`The first line of the address.`),
              )
              .max(2)
              .optional(),
            post_code: z
              .string()
              .max(32)
              .describe(
                `The postal code (aka. zip code) of the address.
`,
              )
              .optional(),
            country: z
              .string()
              .min(2)
              .max(2)
              .describe(`An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`),
            city: z
              .string()
              .max(512)
              .describe(
                `The city of the address.
`,
              )
              .optional(),
            province: z
              .string()
              .max(512)
              .describe(
                `The province where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            region: z
              .string()
              .max(512)
              .describe(
                `The region where the address is located. This may not be relevant in some countries.
`,
              )
              .optional(),
            county: z
              .string()
              .max(512)
              .describe(
                `A county is a geographic region of a country used for administrative or other purposes in some nations. Used in countries such as Ireland, Romania, etc.
`,
              )
              .optional(),
            autonomous_community: z
              .string()
              .max(512)
              .describe(
                `In Spain, an autonomous community is the first sub-national level of political and administrative division.
`,
              )
              .optional(),
            post_town: z
              .string()
              .max(512)
              .describe(
                `A post town is a required part of all postal addresses in the United Kingdom and Ireland, and a basic unit of the postal delivery system.
`,
              )
              .optional(),
            state: z
              .string()
              .max(512)
              .describe(
                `Most often, a country has a single state, with various administrative divisions. The term "state" is sometimes used to refer to the federated polities that make up the federation. Used in countries such as the United States and Brazil.
`,
              )
              .optional(),
            neighborhood: z
              .string()
              .max(512)
              .describe(
                `Locality level of the address. Used in countries such as Brazil or Chile.
`,
              )
              .optional(),
            commune: z
              .string()
              .max(512)
              .describe(
                `In many countries, terms cognate with "commune" are used, referring to the community living in the area and the common interest. Used in countries such as Chile.
`,
              )
              .optional(),
            department: z
              .string()
              .max(512)
              .describe(
                `A department (French: département, Spanish: departamento) is an administrative or political division in several countries. Used in countries such as Colombia.
`,
              )
              .optional(),
            municipality: z
              .string()
              .max(512)
              .describe(
                `A municipality is usually a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. Used in countries such as Colombia.
`,
              )
              .optional(),
            district: z
              .string()
              .max(512)
              .describe(
                `A district is a type of administrative division that in some countries is managed by the local government. Used in countries such as Portugal.
`,
              )
              .optional(),
            zip_code: z
              .string()
              .max(512)
              .describe(
                `A US system of postal codes used by the United States Postal Service (USPS).
`,
              )
              .optional(),
            eircode: z
              .string()
              .max(512)
              .describe(
                `A postal address in Ireland.
`,
              )
              .optional(),
          })
          .describe(
            `An address somewhere in the world. The address fields used depend on the country conventions. For example, in Great Britain, \`city\` is \`post_town\`. In the United States, the top-level administrative unit used in addresses is \`state\`, whereas in Chile it's \`region\`.
Whether an address is valid or not depends on whether the locally required fields are present. Fields not supported in a country will be ignored.`,
          )
          .optional(),
        identifiers: z
          .array(
            z.object({
              ref: z
                .string()
                .max(32)
                .describe(
                  `The unique reference for the personal identifier type.`,
                ),
              value: z
                .string()
                .max(128)
                .describe(`The company identifier value.`),
            }),
          )
          .max(5)
          .describe(
            `A list of country-specific personal identifiers.
`,
          )
          .optional(),
        citizenship: z
          .string()
          .min(2)
          .max(2)
          .describe(
            `An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
country code. This definition users \`oneOf\` with a two-character string
type to allow for support of future countries in client code.`,
          )
          .optional(),
        nationality: z
          .string()
          .nullable()
          .describe(
            `The persons nationality. May be an [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code, but legacy data may not conform to this standard.
`,
          )
          .optional(),
        country_of_residence: z
          .string()
          .min(2)
          .max(2)
          .nullable()
          .describe(
            `An [ISO3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code representing the country where the person resides.
`,
          )
          .optional(),
        version: z
          .string()
          .describe(
            `The version of the resource. The version reflects a specific change submitted to the API via one of the \`PATCH\` endpoints.
`,
          )
          .optional(),
        change_status: z
          .string()
          .describe(
            `Reflects the status of changes submitted through the \`PATCH\` endpoints for the merchant or persons. If some changes have not been applied yet, the status will be \`pending\`. If all changes have been applied, the status \`done\`.
The status is only returned after write operations or on read endpoints when the \`version\` query parameter is provided.
`,
          )
          .optional(),
      }),
    ),
  })
  .passthrough()
  .describe(`Returns a list of persons for a valid merchant identifier.`);
