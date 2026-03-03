import { z } from "zod";

export const listMembershipsParameters = z.object({
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
  kind: z
    .string()
    .describe(
      `The type of the membership resource.
Possible values are:
* \`merchant\` - merchant account(s)
* \`organization\` - organization(s)`,
    )
    .optional(),
  status: z
    .enum(["accepted", "pending", "expired", "disabled", "unknown"])
    .describe(`The status of the membership.`)
    .optional(),
  "resource.type": z
    .string()
    .describe(
      `The type of the membership resource.
Possible values are:
* \`merchant\` - merchant account(s)
* \`organization\` - organization(s)`,
    )
    .optional(),
  "resource.attributes.sandbox": z
    .boolean()
    .optional()
    .describe(
      `Filter memberships by the sandbox status of the resource the membership is in.`,
    ),
  "resource.name": z
    .string()
    .optional()
    .describe(
      `Filter memberships by the name of the resource the membership is in.`,
    ),
  "resource.parent.id": z
    .string()
    .nullable()
    .optional()
    .describe(`Filter memberships by the parent of the resource the membership is in.
When filtering by parent both \`resource.parent.id\` and \`resource.parent.type\` must be present. Pass explicit null to filter for resources without a parent.`),
  "resource.parent.type": z
    .string()
    .describe(
      `The type of the membership resource.
Possible values are:
* \`merchant\` - merchant account(s)
* \`organization\` - organization(s)`,
    )
    .nullable()
    .optional()
    .describe(`Filter memberships by the parent of the resource the membership is in.
When filtering by parent both \`resource.parent.id\` and \`resource.parent.type\` must be present. Pass explicit null to filter for resources without a parent.`),
  roles: z
    .array(z.string())
    .optional()
    .describe(`Filter the returned memberships by role.`),
});

export const listMembershipsResult = z
  .object({
    items: z.array(
      z
        .object({
          id: z.string().describe(`ID of the membership.`),
          resource_id: z
            .string()
            .describe(`ID of the resource the membership is in.`),
          type: z.string().describe(`The type of the membership resource.
Possible values are:
* \`merchant\` - merchant account(s)
* \`organization\` - organization(s)`),
          roles: z.array(z.string()).describe(`User's roles.`),
          permissions: z.array(z.string()).describe(`User's permissions.`),
          created_at: z
            .string()
            .describe(`The timestamp of when the membership was created.`),
          updated_at: z
            .string()
            .describe(`The timestamp of when the membership was last updated.`),
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
          resource: z
            .object({
              id: z
                .string()
                .describe(`ID of the resource the membership is in.`),
              type: z.string().describe(`The type of the membership resource.
Possible values are:
* \`merchant\` - merchant account(s)
* \`organization\` - organization(s)`),
              name: z.string().describe(`Display name of the resource.`),
              logo: z
                .string()
                .max(256)
                .describe(`Logo fo the resource.`)
                .optional(),
              created_at: z
                .string()
                .describe(
                  `The timestamp of when the membership resource was created.`,
                ),
              updated_at: z
                .string()
                .describe(
                  `The timestamp of when the membership resource was last updated.`,
                ),
              attributes: z
                .object({})
                .catchall(z.unknown())
                .nullable()
                .describe(
                  `Object attributes that are modifiable only by SumUp applications.`,
                )
                .optional(),
            })
            .describe(`Information about the resource the membership is in.`),
        })
        .describe(
          `A membership associates a user with a resource, memberships is defined by user, resource, resource type, and associated roles.`,
        ),
    ),
    total_count: z.number().int(),
  })
  .loose()
  .describe(`Returns a list of Membership objects.`);
