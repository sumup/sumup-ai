import type SumUp from "@sumup/sdk";
import type { z } from "zod";

export type Tool<
  Args extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
  Result extends z.ZodTypeAny = z.ZodTypeAny,
> = {
  name: string;
  title: string;
  description: string;
  parameters: Args;
  result: Result;
  callback: (sumup: SumUp, args: z.infer<Args>) => Promise<z.infer<Result>>;
  annotations?: Annotations;
};

type Annotations = {
  /**
   * A human-readable title for the tool.
   */
  title?: string;
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnly?: boolean;
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructive?: boolean;
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotent?: boolean;
  /**
   * OAuth scopes that can be used to authorize access to the endpoint.
   */
  oauthScopes?: string[];
};
