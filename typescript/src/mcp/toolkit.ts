import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import SumUp from "@sumup/sdk";
import { z } from "zod";
import { registerTools, VERSION } from "../common";

// Type guard for checking if an error is an API error with status and response
interface APIErrorLike {
  status: number;
  response: Response;
  message: string;
}

function isAPIError(error: unknown): error is APIErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    // biome-ignore lint/suspicious/noExplicitAny: Type guard needs runtime checking
    typeof (error as any).status === "number" &&
    "response" in error &&
    // biome-ignore lint/suspicious/noExplicitAny: Type guard needs runtime checking
    (error as any).response instanceof Response &&
    "message" in error
  );
}

class SumUpAgentToolkit extends McpServer {
  private _sumup: SumUp;
  private _resource?: string;

  constructor({
    apiKey,
    host,
    resource,
  }: {
    apiKey: string;
    host?: string;
    resource?: string;
    configuration: ServerOptions;
  }) {
    super(
      {
        name: "SumUp",
        version: VERSION,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    );

    this._resource = resource;

    this._sumup = new SumUp({
      apiKey,
      host,
    });

    this.registerResource(
      "SumUp developer documentation",
      "https://developer.sumup.com/llms.txt",
      {
        mimeType: "text/plain",
      },
      async (uri) => {
        // TODO: use URI once new developer portal is rolled out.
        const content = await fetch("https://developer.sumup.com/llms.txt");
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: "text/plain",
              text: await content.text(),
            },
          ],
        };
      },
    );

    this.registerResource(
      "SumUp API OpenAPI specification",
      "https://developer.sumup.com/openapi.json",
      {
        mimeType: "text/plain",
      },
      async (uri) => {
        // TODO: use URI once we serve the raw OpenAPI specs in the developer portal.
        const content = await fetch(
          "https://raw.githubusercontent.com/sumup/openapi/refs/heads/main/openapi.json",
        );
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: "application/json",
              text: await content.text(),
            },
          ],
        };
      },
    );

    registerTools((tool) => {
      this.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.parameters.shape,
          outputSchema:
            tool.result instanceof z.ZodObject ? tool.result.shape : undefined,
          annotations: {
            title: tool.annotations?.title,
            readOnlyHint: tool.annotations?.readOnly,
            destructiveHint: tool.annotations?.destructive,
            idempotentHint: tool.annotations?.idempotent,
          },
        },
        async (
          args: z.infer<typeof tool.parameters>,
        ): Promise<CallToolResult> => {
          try {
            const result = tool.result.parse(
              await tool.callback(this._sumup, args),
            );
            const structuredContent =
              typeof result === "object" && result !== null
                ? (result as Record<string, unknown>)
                : undefined;

            return {
              structuredContent,
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(structuredContent, null, 2),
                },
              ],
            };
          } catch (error) {
            // Handle OAuth authorization errors
            if (isAPIError(error) && error.status === 401) {
              const wwwAuthenticate =
                error.response.headers.get("www-authenticate");

              if (wwwAuthenticate && this._resource) {
                // Parse www-authenticate header to check if it's an OAuth error
                const isOAuthError =
                  this._parseWWWAuthenticate(wwwAuthenticate);

                if (isOAuthError) {
                  // Add resource_metadata to the www-authenticate header
                  const enhancedHeader = this._addResourceMetadata(
                    wwwAuthenticate,
                    this._resource,
                  );

                  // Throw McpError with www-authenticate header in data
                  // This follows the MCP error protocol for authorization errors
                  throw new McpError(
                    ErrorCode.InternalError,
                    "Authentication required",
                    {
                      wwwAuthenticate: enhancedHeader,
                    },
                  );
                }
              }
            }

            // For any other errors, re-throw to let MCP SDK handle them
            if (error instanceof Error) {
              throw error;
            }

            throw new Error(String(error));
          }
        },
      );
    });
  }

  /**
   * Parse WWW-Authenticate header to check if it contains OAuth challenge parameters.
   * Returns true if the header appears to be an OAuth Bearer challenge.
   */
  private _parseWWWAuthenticate(header: string): boolean {
    // Check if it's a Bearer challenge
    if (!header.toLowerCase().startsWith("bearer")) {
      return false;
    }

    // OAuth Bearer challenges typically contain error, error_description, or scope
    return /\b(error|scope|realm)\s*=/i.test(header);
  }

  /**
   * Add or override resource_metadata in WWW-Authenticate header.
   */
  private _addResourceMetadata(header: string, resource: string): string {
    const trimmed = header.trim();

    // If resource_metadata already exists, replace it
    if (/resource_metadata\s*=/i.test(trimmed)) {
      return trimmed.replace(
        /resource_metadata\s*=\s*"[^"]*"/gi,
        `resource_metadata="${resource}"`,
      );
    }

    // Add resource_metadata to the header
    // Format: Bearer error="...", resource_metadata="..."
    // If header ends with quotes, add comma and parameter
    // Otherwise just append it
    if (trimmed.endsWith('"') || trimmed.endsWith("'")) {
      return `${trimmed}, resource_metadata="${resource}"`;
    }

    // If there are existing parameters, add comma
    if (trimmed.includes("=")) {
      return `${trimmed}, resource_metadata="${resource}"`;
    }

    // Otherwise, add it after "Bearer"
    return `${trimmed} resource_metadata="${resource}"`;
  }
}

export default SumUpAgentToolkit;
