import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import SumUp, { APIError } from "@sumup/sdk";
import { z } from "zod";
import {
  constructResourceMetadata,
  parseWWWAuthenticateChallenges,
  registerTools,
  stringifyWWWAuthenticateChallenges,
  VERSION,
} from "../common";

class SumUpAgentToolkit extends McpServer {
  private _sumup: SumUp;
  private _resourceMetadata?: string;

  constructor({
    apiKey,
    host,
    resource,
    resourceMetadata,
  }: {
    apiKey: string;
    host?: string;
    resource?: string;
    resourceMetadata?: string;
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
          logging: {},
        },
      },
    );

    this._resourceMetadata =
      resourceMetadata ?? constructResourceMetadata(resource);

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
        const content = await fetch(uri.toString());
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
        const content = await fetch(uri.toString());
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
            if (error instanceof APIError && error.status === 401) {
              const wwwAuthenticate =
                error.response.headers.get("www-authenticate");

              if (wwwAuthenticate && this._resourceMetadata) {
                const challenges =
                  parseWWWAuthenticateChallenges(wwwAuthenticate);
                if (
                  challenges?.some((challenge) => challenge.scheme === "bearer")
                ) {
                  const enhancedHeader = stringifyWWWAuthenticateChallenges(
                    challenges.map((challenge) => {
                      if (challenge.scheme !== "bearer" || challenge.token68) {
                        return challenge;
                      }

                      return {
                        ...challenge,
                        parameters: {
                          ...challenge.parameters,
                          resource_metadata: this._resourceMetadata,
                        },
                      };
                    }),
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
}

export default SumUpAgentToolkit;
