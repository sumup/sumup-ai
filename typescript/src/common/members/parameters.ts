import { z } from "zod";

export const createMerchantMemberParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  is_managed_user: z
    .boolean()
    .describe(
      `True if the user is managed by the merchant. In this case, we'll created a virtual user with the provided password and nickname.`,
    )
    .optional(),
  email: z.string().describe(`Email address of the member to add.`),
  password: z
    .string()
    .min(8)
    .describe(
      `Password of the member to add. Only used if \`is_managed_user\` is true. In the case of service accounts, the password is not used and can not be defined by the caller.`,
    )
    .optional(),
  nickname: z
    .string()
    .describe(
      `Nickname of the member to add. Only used if \`is_managed_user\` is true. Used for display purposes only.`,
    )
    .optional(),
  roles: z
    .array(z.string())
    .describe(`List of roles to assign to the new member.`),
  metadata: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
    )
    .optional(),
  attributes: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Object attributes that are modifiable only by SumUp applications.`,
    )
    .optional(),
});

export const createMerchantMemberResult = z
  .object({
    id: z.string().describe(`ID of the member.`),
    roles: z.array(z.string()).describe(`User's roles.`),
    permissions: z.array(z.string()).describe(`User's permissions.`),
    created_at: z
      .string()
      .describe(`The timestamp of when the member was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the member was last updated.`),
    user: z
      .object({
        id: z
          .string()
          .describe(`Identifier for the End-User (also called Subject).`),
        email: z
          .string()
          .describe(
            `End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, for unique identification use ID instead.`,
          ),
        mfa_on_login_enabled: z
          .boolean()
          .describe(`True if the user has enabled MFA on login.`),
        virtual_user: z
          .boolean()
          .describe(`True if the user is a virtual user (operator).`),
        service_account_user: z
          .boolean()
          .describe(`True if the user is a service account.`),
        disabled_at: z
          .string()
          .describe(
            `Time when the user has been disabled. Applies only to virtual users (\`virtual_user: true\`).`,
          )
          .optional(),
        nickname: z
          .string()
          .describe(`User's preferred name. Used for display purposes only.`)
          .optional(),
        picture: z
          .string()
          .describe(
            `URL of the End-User's profile picture. This URL refers to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image.`,
          )
          .optional(),
        classic: z
          .object({
            user_id: z.number().int(),
          })
          .describe(`Classic identifiers of the user.`)
          .optional(),
      })
      .describe(`Information about the user associated with the membership.`)
      .optional(),
    invite: z
      .object({
        email: z.string().describe(`Email address of the invited user.`),
        expires_at: z.string(),
      })
      .describe(`Pending invitation for membership.`)
      .optional(),
    status: z
      .enum(["accepted", "pending", "expired", "disabled", "unknown"])
      .describe(`The status of the membership.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
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
  .loose()
  .describe(
    `A member is user within specific resource identified by resource id, resource type, and associated roles.`,
  );

export const deleteMerchantMemberParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  memberId: z.string().describe(`The ID of the member to retrieve.`),
});

export const deleteMerchantMemberResult = z.any();

export const getMerchantMemberParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  memberId: z.string().describe(`The ID of the member to retrieve.`),
});

export const getMerchantMemberResult = z
  .object({
    id: z.string().describe(`ID of the member.`),
    roles: z.array(z.string()).describe(`User's roles.`),
    permissions: z.array(z.string()).describe(`User's permissions.`),
    created_at: z
      .string()
      .describe(`The timestamp of when the member was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the member was last updated.`),
    user: z
      .object({
        id: z
          .string()
          .describe(`Identifier for the End-User (also called Subject).`),
        email: z
          .string()
          .describe(
            `End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, for unique identification use ID instead.`,
          ),
        mfa_on_login_enabled: z
          .boolean()
          .describe(`True if the user has enabled MFA on login.`),
        virtual_user: z
          .boolean()
          .describe(`True if the user is a virtual user (operator).`),
        service_account_user: z
          .boolean()
          .describe(`True if the user is a service account.`),
        disabled_at: z
          .string()
          .describe(
            `Time when the user has been disabled. Applies only to virtual users (\`virtual_user: true\`).`,
          )
          .optional(),
        nickname: z
          .string()
          .describe(`User's preferred name. Used for display purposes only.`)
          .optional(),
        picture: z
          .string()
          .describe(
            `URL of the End-User's profile picture. This URL refers to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image.`,
          )
          .optional(),
        classic: z
          .object({
            user_id: z.number().int(),
          })
          .describe(`Classic identifiers of the user.`)
          .optional(),
      })
      .describe(`Information about the user associated with the membership.`)
      .optional(),
    invite: z
      .object({
        email: z.string().describe(`Email address of the invited user.`),
        expires_at: z.string(),
      })
      .describe(`Pending invitation for membership.`)
      .optional(),
    status: z
      .enum(["accepted", "pending", "expired", "disabled", "unknown"])
      .describe(`The status of the membership.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
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
  .loose()
  .describe(
    `A member is user within specific resource identified by resource id, resource type, and associated roles.`,
  );

export const listMerchantMembersParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  offset: z
    .number()
    .int()
    .optional()
    .describe(`Offset of the first member to return.`),
  limit: z
    .number()
    .int()
    .optional()
    .describe(`Maximum number of members to return.`),
  scroll: z.boolean().optional().describe(`Indicates to skip count query.`),
  email: z
    .string()
    .optional()
    .describe(`Filter the returned members by email address prefix.`),
  "user.id": z.string().optional().describe(`Search for a member by user id.`),
  status: z
    .enum(["accepted", "pending", "expired", "disabled", "unknown"])
    .describe(`The status of the membership.`)
    .optional(),
  roles: z
    .array(z.string())
    .optional()
    .describe(`Filter the returned members by role.`),
});

export const listMerchantMembersResult = z
  .object({
    items: z.array(
      z
        .object({
          id: z.string().describe(`ID of the member.`),
          roles: z.array(z.string()).describe(`User's roles.`),
          permissions: z.array(z.string()).describe(`User's permissions.`),
          created_at: z
            .string()
            .describe(`The timestamp of when the member was created.`),
          updated_at: z
            .string()
            .describe(`The timestamp of when the member was last updated.`),
          user: z
            .object({
              id: z
                .string()
                .describe(`Identifier for the End-User (also called Subject).`),
              email: z
                .string()
                .describe(
                  `End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, for unique identification use ID instead.`,
                ),
              mfa_on_login_enabled: z
                .boolean()
                .describe(`True if the user has enabled MFA on login.`),
              virtual_user: z
                .boolean()
                .describe(`True if the user is a virtual user (operator).`),
              service_account_user: z
                .boolean()
                .describe(`True if the user is a service account.`),
              disabled_at: z
                .string()
                .describe(
                  `Time when the user has been disabled. Applies only to virtual users (\`virtual_user: true\`).`,
                )
                .optional(),
              nickname: z
                .string()
                .describe(
                  `User's preferred name. Used for display purposes only.`,
                )
                .optional(),
              picture: z
                .string()
                .describe(
                  `URL of the End-User's profile picture. This URL refers to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image.`,
                )
                .optional(),
              classic: z
                .object({
                  user_id: z.number().int(),
                })
                .describe(`Classic identifiers of the user.`)
                .optional(),
            })
            .describe(
              `Information about the user associated with the membership.`,
            )
            .optional(),
          invite: z
            .object({
              email: z.string().describe(`Email address of the invited user.`),
              expires_at: z.string(),
            })
            .describe(`Pending invitation for membership.`)
            .optional(),
          status: z
            .enum(["accepted", "pending", "expired", "disabled", "unknown"])
            .describe(`The status of the membership.`),
          metadata: z
            .object({})
            .catchall(z.unknown())
            .nullable()
            .describe(
              `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
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
          `A member is user within specific resource identified by resource id, resource type, and associated roles.`,
        ),
    ),
    total_count: z.number().int().optional(),
  })
  .loose()
  .describe(`Returns a list of Member objects.`);

export const updateMerchantMemberParameters = z.object({
  merchantCode: z
    .string()
    .describe(`Short unique identifier for the merchant.`),
  memberId: z.string().describe(`The ID of the member to retrieve.`),
  roles: z.array(z.string()).optional(),
  metadata: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
    )
    .optional(),
  attributes: z
    .object({})
    .catchall(z.unknown())
    .describe(
      `Object attributes that are modifiable only by SumUp applications.`,
    )
    .optional(),
  user: z
    .object({
      nickname: z
        .string()
        .describe(`User's preferred name. Used for display purposes only.`)
        .optional(),
      password: z
        .string()
        .min(8)
        .describe(
          `Password of the member to add. Only used if \`is_managed_user\` is true.`,
        )
        .optional(),
    })
    .describe(`Allows you to update user data of managed users.`)
    .optional(),
});

export const updateMerchantMemberResult = z
  .object({
    id: z.string().describe(`ID of the member.`),
    roles: z.array(z.string()).describe(`User's roles.`),
    permissions: z.array(z.string()).describe(`User's permissions.`),
    created_at: z
      .string()
      .describe(`The timestamp of when the member was created.`),
    updated_at: z
      .string()
      .describe(`The timestamp of when the member was last updated.`),
    user: z
      .object({
        id: z
          .string()
          .describe(`Identifier for the End-User (also called Subject).`),
        email: z
          .string()
          .describe(
            `End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, for unique identification use ID instead.`,
          ),
        mfa_on_login_enabled: z
          .boolean()
          .describe(`True if the user has enabled MFA on login.`),
        virtual_user: z
          .boolean()
          .describe(`True if the user is a virtual user (operator).`),
        service_account_user: z
          .boolean()
          .describe(`True if the user is a service account.`),
        disabled_at: z
          .string()
          .describe(
            `Time when the user has been disabled. Applies only to virtual users (\`virtual_user: true\`).`,
          )
          .optional(),
        nickname: z
          .string()
          .describe(`User's preferred name. Used for display purposes only.`)
          .optional(),
        picture: z
          .string()
          .describe(
            `URL of the End-User's profile picture. This URL refers to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image.`,
          )
          .optional(),
        classic: z
          .object({
            user_id: z.number().int(),
          })
          .describe(`Classic identifiers of the user.`)
          .optional(),
      })
      .describe(`Information about the user associated with the membership.`)
      .optional(),
    invite: z
      .object({
        email: z.string().describe(`Email address of the invited user.`),
        expires_at: z.string(),
      })
      .describe(`Pending invitation for membership.`)
      .optional(),
    status: z
      .enum(["accepted", "pending", "expired", "disabled", "unknown"])
      .describe(`The status of the membership.`),
    metadata: z
      .object({})
      .catchall(z.unknown())
      .nullable()
      .describe(
        `Set of user-defined key-value pairs attached to the object. Partial updates are not supported. When updating, always submit whole metadata. Maximum of 64 parameters are allowed in the object.`,
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
  .loose()
  .describe(
    `A member is user within specific resource identified by resource id, resource type, and associated roles.`,
  );
