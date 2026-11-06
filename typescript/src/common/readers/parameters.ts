import { z } from "zod";

export const createGoReaderCheckoutParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  readerId: z
    .string()
    .min(30)
    .max(30)
    .describe(
      `Unique identifier of the reader that the payment is initiated on.`,
    ),
  affiliate: z
    .object({
      app_id: z.string(),
      key: z.string(),
    })
    .optional(),
  client_transaction_id: z
    .string()
    .describe(
      `Caller-supplied correlation identifier, used as the idempotency key.`,
    ),
  tip_amount: z
    .number()
    .int()
    .describe(`Portion of total_amount that is a tip, in minor units.`)
    .optional(),
  total_amount: z.object({
    currency: z.string().describe(`Currency ISO 4217 code`),
    value: z.number().int().describe(`Amount in minor units (e.g. cents).`),
  }),
});

export const createGoReaderCheckoutResult = z
  .object({
    data: z
      .object({
        client_transaction_id: z
          .string()
          .describe(
            `Caller-supplied correlation identifier that was provided in the request.`,
          )
          .optional(),
        transaction_code: z
          .string()
          .describe(
            `Transaction code returned by the acquirer/processing entity after processing the transaction.`,
          )
          .optional(),
      })
      .optional(),
  })
  .loose()
  .describe(`Returns the result of the payment initiated on the reader.`);

export const createReaderParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  pairing_code: z
    .string()
    .min(8)
    .max(9)
    .describe(
      `The pairing code is a 8 or 9 character alphanumeric string that is displayed on a SumUp Device after initiating the pairing. It is used to link the physical device to the created pairing.`,
    ),
  name: z
    .string()
    .max(500)
    .describe(
      `Custom human-readable, user-defined name for easier identification of the reader.`,
    ),
  metadata: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
    )
    .optional(),
});

export const createReaderResult = z
  .object({
    id: z
      .string()
      .min(30)
      .max(30)
      .describe(
        `Unique identifier of the reader that the payment is initiated on.`,
      ),
    name: z
      .string()
      .max(500)
      .describe(
        `Custom human-readable, user-defined name for easier identification of the reader.`,
      ),
    status: z
      .enum(["unknown", "processing", "paired", "expired"])
      .describe(`The status of the reader object gives information about the current state of the reader.

Possible values:

- \`unknown\` - The reader status is unknown.
- \`processing\` - The reader is created and waits for the physical device to confirm the pairing.
- \`paired\` - The reader is paired with a merchant account and can be used with SumUp APIs.
- \`expired\` - The pairing is expired and no longer usable with the account. The resource needs to get recreated.`),
    device: z
      .object({
        identifier: z
          .string()
          .describe(
            `A unique identifier of the physical device (e.g. serial number).`,
          ),
        model: z
          .enum(["solo", "virtual-solo"])
          .describe(`Identifier of the model of the device.`),
      })
      .describe(`Information about the underlying physical device.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
      )
      .optional(),
    service_account_id: z
      .string()
      .describe(
        `Identifier of the system-managed service account associated with this reader.
Present only for readers that are already paired.
This field is currently in beta and may change.`,
      )
      .optional(),
    created_at: z
      .string()
      .describe(`The timestamp of when the reader was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the reader was last updated.`),
  })
  .loose()
  .describe(
    `A physical card reader device that can accept in-person payments.`,
  );

export const createReaderCheckoutParameters = z
  .object({
    merchantCode: z.string().describe(`Merchant Code`),
    readerId: z.string().describe(`The unique identifier of the Reader`),
    aade: z
      .object({
        provider_id: z
          .string()
          .describe(`The identifier of the AADE signature provider.`),
        signature: z
          .string()
          .describe(`The base64 encoded signature of the transaction data.`),
        signature_data: z
          .string()
          .describe(`The string containing the signed transaction data.`),
      })
      .describe(
        `Optional object containing data for transactions from ERP integrators in Greece that comply with the AADE 1155 protocol.
When such regulatory/business requirements apply, this object must be provided and contains the data needed to validate the transaction with the AADE signature provider.
`,
      )
      .optional(),
    affiliate: z
      .object({
        app_id: z
          .string()
          .describe(`Integrator application identifier from the [Affiliate Keys](https://developer.sumup.com/affiliate-keys) page.
Required when the affiliate object is provided.
`),
        foreign_transaction_id: z
          .string()
          .describe(
            `Integrator-owned transaction reference. Optional.
Can be used to retrieve the transaction via the [Transactions API](https://developer.sumup.com/api/transactions/get).
`,
          )
          .optional(),
        key: z
          .string()
          .describe(`Affiliate key generated in the [Affiliate Keys](https://developer.sumup.com/affiliate-keys) page.
Required when the affiliate object is provided.
`),
        tags: z
          .object({})
          .catchall(z.unknown())
          .describe(
            `Optional key-value metadata associated with the transaction.
`,
          )
          .optional(),
      })
      .nullable()
      .describe(
        `Optional affiliate metadata associated with the checkout's payment.
Provide both \`app_id\` and \`key\` when including this object.
`,
      )
      .optional(),
    card_type: z
      .enum(["credit", "debit"])
      .describe(
        `The card type of the card used for the transaction.
It is required only for some countries (e.g: Brazil).
`,
      )
      .optional(),
    description: z
      .string()
      .describe(`Description of the checkout to be shown in the Merchant Sales`)
      .optional(),
    installments: z
      .number()
      .int()
      .nullable()
      .describe(
        `Number of installments for the transaction.
It may vary according to the merchant country.
For example, in Brazil, the maximum number of installments is 12.

Omit if the merchant country does not support installments.
Otherwise, the checkout will be rejected.
`,
      )
      .optional(),
    payment_type: z
      .enum(["card", "pix"])
      .describe(
        `The payment method type for the transaction. Defaults to \`card\`.

Use \`pix\` to initiate a Pix QR-code payment flow on the device.
Pix is only supported for Brazilian merchants; other merchants will receive a 422 error.
`,
      )
      .optional(),
    return_url: z
      .string()
      .describe(
        `Webhook URL to which the payment result will be sent.
It must be a HTTPS url.
`,
      )
      .optional(),
    tip_rates: z
      .array(z.number())
      .min(3)
      .max(3)
      .describe(
        `Exactly three distinct tipping rates to be displayed to the cardholder.
Each rate is a fraction between 0.01 and 1.00 in increments of 0.01.
The rates are sorted in ascending order by the server.
`,
      )
      .optional(),
    tip_timeout: z
      .number()
      .int()
      .describe(
        `Time in seconds the cardholder has to select a tip rate.
If not provided, the default value is 30 seconds.

It can only be set if \`tip_rates\` is provided.

**Note**: If the target device is a Solo, it must be in version 3.3.38.0 or higher.
`,
      )
      .optional(),
    total_amount: z
      .object({
        currency: z.string().describe(`Currency ISO 4217 code`),
        minor_unit: z
          .number()
          .int()
          .describe(`The minor units of the currency.
It represents the number of decimals of the currency. For the currencies CLP, COP and HUF, the minor unit is 0.
`),
        value: z.number().int().describe(`Integer value of the amount.`),
      })
      .describe(`Amount structure.

The amount is represented as an integer value altogether with the currency and the minor unit.

For example, EUR 1.00 is represented as value 100 with minor unit of 2.
`),
  })
  .describe(`Payment details for a Reader Checkout.`);

export const createReaderCheckoutResult = z
  .object({
    data: z.object({
      checkout_id: z
        .string()
        .describe(
          `The checkout ID is a unique identifier for the checkout.
`,
        )
        .optional(),
      client_transaction_id: z
        .string()
        .describe(`Unique identifier for the transaction associated with this checkout.
Use this value to match the checkout with payment events and transaction records.
`),
    }),
  })
  .loose()
  .describe(`The Checkout got successfully created for the given reader.`);

export const createReaderTerminateParameters = z.object({
  merchantCode: z.string().describe(`Merchant Code`),
  readerId: z.string().describe(`The unique identifier of the Reader`),
});

export const createReaderTerminateResult = z.any();

export const deleteReaderParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  readerId: z
    .string()
    .min(30)
    .max(30)
    .describe(
      `Unique identifier of the reader that the payment is initiated on.`,
    ),
});

export const deleteReaderResult = z.any();

export const getReaderParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  readerId: z
    .string()
    .min(30)
    .max(30)
    .describe(
      `Unique identifier of the reader that the payment is initiated on.`,
    ),
});

export const getReaderResult = z
  .object({
    id: z
      .string()
      .min(30)
      .max(30)
      .describe(
        `Unique identifier of the reader that the payment is initiated on.`,
      ),
    name: z
      .string()
      .max(500)
      .describe(
        `Custom human-readable, user-defined name for easier identification of the reader.`,
      ),
    status: z
      .enum(["unknown", "processing", "paired", "expired"])
      .describe(`The status of the reader object gives information about the current state of the reader.

Possible values:

- \`unknown\` - The reader status is unknown.
- \`processing\` - The reader is created and waits for the physical device to confirm the pairing.
- \`paired\` - The reader is paired with a merchant account and can be used with SumUp APIs.
- \`expired\` - The pairing is expired and no longer usable with the account. The resource needs to get recreated.`),
    device: z
      .object({
        identifier: z
          .string()
          .describe(
            `A unique identifier of the physical device (e.g. serial number).`,
          ),
        model: z
          .enum(["solo", "virtual-solo"])
          .describe(`Identifier of the model of the device.`),
      })
      .describe(`Information about the underlying physical device.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
      )
      .optional(),
    service_account_id: z
      .string()
      .describe(
        `Identifier of the system-managed service account associated with this reader.
Present only for readers that are already paired.
This field is currently in beta and may change.`,
      )
      .optional(),
    created_at: z
      .string()
      .describe(`The timestamp of when the reader was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the reader was last updated.`),
  })
  .loose()
  .describe(
    `A physical card reader device that can accept in-person payments.`,
  );

export const getReaderCheckoutParameters = z.object({
  merchantCode: z.string().describe(`Merchant Code`),
  readerId: z.string().describe(`The unique identifier of the Reader`),
  checkoutId: z.string().describe(`The unique identifier of the Checkout`),
});

export const getReaderCheckoutResult = z
  .object({
    data: z.object({
      card_type: z
        .union([z.literal("credit"), z.literal("debit"), z.literal(null)])
        .nullable()
        .describe(`Type of the card, or null when no card type was specified.`),
      checkout_id: z.string().describe(`Unique identifier for the checkout`),
      client_transaction_id: z
        .string()
        .describe(`Client transaction identifier associated with the checkout`),
      created_at: z.string().describe(`Checkout creation timestamp`),
      installments: z
        .number()
        .int()
        .nullable()
        .describe(
          `Number of installments for the transaction. Required for some countries.`,
        ),
      payment_failure_reason: z
        .string()
        .nullable()
        .describe(
          `Reason for the payment failure, or null when no failure reason is available.`,
        ),
      payment_status: z
        .string()
        .nullable()
        .describe(
          `Status of the payment, or null when no payment status is available.`,
        ),
      payment_type: z
        .enum(["card", "pix"])
        .describe(`Type of the payment. Required for some countries`),
      reader_firmware_version: z.string().describe(`Reader firmware version`),
      reader_serial_number: z.string().describe(`Device serial number`),
      status: z
        .enum(["pending", "successful", "failed", "cancelled"])
        .describe(`Current status of the checkout`),
      total_amount: z
        .object({
          currency: z.string().describe(`Currency ISO 4217 code`),
          minor_unit: z
            .number()
            .int()
            .describe(`The minor units of the currency.
It represents the number of decimals of the currency. For the currencies CLP, COP and HUF, the minor unit is 0.
`),
          value: z.number().int().describe(`Integer value of the amount.`),
        })
        .describe(`Amount structure.

The amount is represented as an integer value altogether with the currency and the minor unit.

For example, EUR 1.00 is represented as value 100 with minor unit of 2.
`),
      updated_at: z.string().describe(`Checkout last update timestamp`),
      valid_until: z
        .string()
        .nullable()
        .describe(
          `Checkout expiration timestamp. After this time, the checkout will be automatically cancelled.`,
        ),
    }),
  })
  .loose()
  .describe(`The Checkout got successfully retrieved for the given reader.`);

export const getReaderSettingsParameters = z.object({
  merchantCode: z
    .string()
    .describe(`The merchant code of the account that owns the reader.`),
  readerId: z.string().describe(`The unique identifier of the reader.`),
});

export const getReaderSettingsResult = z
  .object({
    data: z.object({
      menu_lock: z
        .object({
          enabled: z
            .boolean()
            .describe(`Whether menu lock is enabled.`)
            .optional(),
          passcode: z
            .string()
            .describe(`Four-digit PIN used to unlock the reader's menu.`)
            .optional(),
        })
        .describe(
          `Menu lock configuration. Fields may be absent if no value is available.`,
        ),
    }),
  })
  .loose()
  .describe(`Menu lock settings reported by the reader, or the last saved settings when offline.
`);

export const getReaderStatusParameters = z.object({
  merchantCode: z.string().describe(`Merchant Code`),
  readerId: z.string().describe(`The unique identifier of the Reader`),
});

export const getReaderStatusResult = z
  .object({
    data: z.object({
      battery_level: z.number().describe(`Battery level percentage`).optional(),
      battery_temperature: z
        .number()
        .int()
        .describe(`Battery temperature in Celsius`)
        .optional(),
      connection_type: z
        .enum(["btle", "edge", "gprs", "lte", "umts", "usb", "Wi-Fi"])
        .describe(`Type of connection used by the device`)
        .optional(),
      firmware_version: z
        .string()
        .describe(`Firmware version of the device`)
        .optional(),
      last_activity: z
        .string()
        .describe(`Timestamp of the last activity from the device`)
        .optional(),
      state: z
        .enum([
          "IDLE",
          "SELECTING_TIP",
          "WAITING_FOR_CARD",
          "WAITING_FOR_PIN",
          "WAITING_FOR_SIGNATURE",
          "UPDATING_FIRMWARE",
        ])
        .describe(`Latest state of the device`)
        .optional(),
      status: z.enum(["ONLINE", "OFFLINE"]).describe(`Status of a device`),
    }),
  })
  .loose()
  .describe(`Status of a device`);

export const listReadersParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
});

export const listReadersResult = z
  .object({
    items: z.array(
      z
        .object({
          id: z
            .string()
            .min(30)
            .max(30)
            .describe(
              `Unique identifier of the reader that the payment is initiated on.`,
            ),
          name: z
            .string()
            .max(500)
            .describe(
              `Custom human-readable, user-defined name for easier identification of the reader.`,
            ),
          status: z
            .enum(["unknown", "processing", "paired", "expired"])
            .describe(`The status of the reader object gives information about the current state of the reader.

Possible values:

- \`unknown\` - The reader status is unknown.
- \`processing\` - The reader is created and waits for the physical device to confirm the pairing.
- \`paired\` - The reader is paired with a merchant account and can be used with SumUp APIs.
- \`expired\` - The pairing is expired and no longer usable with the account. The resource needs to get recreated.`),
          device: z
            .object({
              identifier: z
                .string()
                .describe(
                  `A unique identifier of the physical device (e.g. serial number).`,
                ),
              model: z
                .enum(["solo", "virtual-solo"])
                .describe(`Identifier of the model of the device.`),
            })
            .describe(`Information about the underlying physical device.`),
          metadata: z
            .object({})
            .catchall(z.unknown())
            .nullable()
            .describe(
              `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
            )
            .optional(),
          service_account_id: z
            .string()
            .describe(
              `Identifier of the system-managed service account associated with this reader.
Present only for readers that are already paired.
This field is currently in beta and may change.`,
            )
            .optional(),
          created_at: z
            .string()
            .describe(`The timestamp of when the reader was created.`),
          updated_at: z
            .string()
            .describe(`The timestamp of when the reader was last updated.`),
        })
        .describe(
          `A physical card reader device that can accept in-person payments.`,
        ),
    ),
  })
  .loose()
  .describe(`Returns a list Reader objects.`);

export const updateReaderParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  readerId: z
    .string()
    .min(30)
    .max(30)
    .describe(
      `Unique identifier of the reader that the payment is initiated on.`,
    ),
  name: z
    .string()
    .max(500)
    .describe(
      `Custom human-readable, user-defined name for easier identification of the reader.`,
    )
    .optional(),
  metadata: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
    )
    .optional(),
});

export const updateReaderResult = z
  .object({
    id: z
      .string()
      .min(30)
      .max(30)
      .describe(
        `Unique identifier of the reader that the payment is initiated on.`,
      ),
    name: z
      .string()
      .max(500)
      .describe(
        `Custom human-readable, user-defined name for easier identification of the reader.`,
      ),
    status: z
      .enum(["unknown", "processing", "paired", "expired"])
      .describe(`The status of the reader object gives information about the current state of the reader.

Possible values:

- \`unknown\` - The reader status is unknown.
- \`processing\` - The reader is created and waits for the physical device to confirm the pairing.
- \`paired\` - The reader is paired with a merchant account and can be used with SumUp APIs.
- \`expired\` - The pairing is expired and no longer usable with the account. The resource needs to get recreated.`),
    device: z
      .object({
        identifier: z
          .string()
          .describe(
            `A unique identifier of the physical device (e.g. serial number).`,
          ),
        model: z
          .enum(["solo", "virtual-solo"])
          .describe(`Identifier of the model of the device.`),
      })
      .describe(`Information about the underlying physical device.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
      )
      .optional(),
    service_account_id: z
      .string()
      .describe(
        `Identifier of the system-managed service account associated with this reader.
Present only for readers that are already paired.
This field is currently in beta and may change.`,
      )
      .optional(),
    created_at: z
      .string()
      .describe(`The timestamp of when the reader was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the reader was last updated.`),
  })
  .loose()
  .describe(
    `A physical card reader device that can accept in-person payments.`,
  );

export const updateReaderSettingsParameters = z
  .object({
    merchantCode: z
      .string()
      .describe(`The merchant code of the account that owns the reader.`),
    readerId: z.string().describe(`The unique identifier of the reader.`),
    menu_lock: z
      .object({
        enabled: z
          .boolean()
          .describe(`Whether menu lock is enabled.`)
          .optional(),
        passcode: z
          .string()
          .describe(`Four-digit PIN used to unlock the reader's menu.`)
          .optional(),
      })
      .describe(
        `Menu lock configuration. Provide at least one of \`enabled\` or \`passcode\`.`,
      ),
  })
  .describe(`Menu lock settings to update for a Solo reader.`);

export const updateReaderSettingsResult = z
  .object({
    data: z.object({
      menu_lock: z
        .object({
          enabled: z
            .boolean()
            .describe(`Whether menu lock is enabled.`)
            .optional(),
          passcode: z
            .string()
            .describe(`Four-digit PIN used to unlock the reader's menu.`)
            .optional(),
        })
        .describe(
          `Settings included in the update. Omitted fields are not returned.`,
        ),
      status: z
        .enum(["applied"])
        .describe(`Indicates that the reader applied the settings update.`),
    }),
  })
  .loose()
  .describe(`Menu lock settings applied to the reader.`);
