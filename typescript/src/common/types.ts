import type SumUp from "@sumup/sdk";
import type { z } from "zod";

/** Shared tool definition adapted to each framework's registration format. */
export type Tool<
  Args extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  Result extends z.ZodTypeAny = z.ZodTypeAny,
  Name extends string = string,
> = {
  name: Name;
  title: string;
  description: string;
  parameters: Args;
  /** Validates callback results before an adapter formats them for its client. */
  result: Result;
  callback: (sumup: SumUp, args: z.infer<Args>) => Promise<unknown>;
  annotations?: Annotations;
};

/**
 * Behavioral metadata shared by the adapters. The MCP adapter maps readOnly,
 * openWorld, destructive, and idempotent to the corresponding `*Hint` fields.
 * Hints describe behavior; they do not enforce authorization or confirmation.
 * Defaults below are MCP client interpretations, not values applied here.
 *
 * @see https://modelcontextprotocol.io/specification/2025-11-25/schema#toolannotations
 */
export type Annotations = {
  /**
   * A human-readable title for the tool.
   */
  title?: string;
  /**
   * True when every supported mode only reads or computes data without writes.
   *
   * Default: false
   */
  readOnly?: boolean;
  /**
   * Maps to MCP's openWorldHint: whether the tool can interact with an open
   * world rather than a bounded domain. This toolkit treats private SumUp
   * account operations as bounded; invitations and external callbacks are open.
   *
   * MCP default when omitted: true.
   */
  openWorld?: boolean;
  /**
   * Toolkit-specific approval default for the AI SDK and OpenAI Agents adapters.
   * An explicit approval policy can override it. This is not an MCP annotation
   * and does not make an MCP client ask for confirmation.
   *
   * Default: false
   */
  requiresApproval?: boolean;
  /**
   * True if any supported mode can overwrite or remove data, revoke access,
   * or perform an irreversible action such as a payment or invitation.
   * False for writes that only add data.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructive?: boolean;
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotent?: boolean;
  /**
   * Endpoint scopes advertised as adapter metadata.
   */
  oauthScopes?: string[];
};

export type ApprovalPolicy = (
  tool: Pick<Tool, "name" | "title" | "annotations">,
  input: unknown,
) => boolean | Promise<boolean>;
