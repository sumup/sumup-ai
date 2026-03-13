import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import type SumUp from "@sumup/sdk";
import { APIError } from "@sumup/sdk";

const mockToolkitState = {
  callback: async (_sumup: SumUp) => ({ ok: true }),
};

jest.mock("../common", () => {
  const actual = jest.requireActual("../common");
  const { z } = jest.requireActual("zod");

  return {
    ...actual,
    registerTools: (
      reg: (tool: {
        name: string;
        title: string;
        description: string;
        parameters: ReturnType<typeof z.object>;
        result: ReturnType<typeof z.object>;
        callback: typeof mockToolkitState.callback;
      }) => void,
    ) => {
      reg({
        name: "mock_tool",
        title: "Mock tool",
        description: "Mock tool for toolkit error handling tests",
        parameters: z.object({}),
        result: z.object({
          ok: z.boolean(),
        }),
        callback: async (sumup: SumUp) => mockToolkitState.callback(sumup),
      });
    },
  };
});

import SumUpAgentToolkit from "./toolkit";

describe("mcp toolkit auth error handling", () => {
  test("uses authInfo token as a per-request authorization override", async () => {
    mockToolkitState.callback = async (sumup: SumUp) => {
      const headers = new Headers(sumup.baseParams.headers);
      return {
        ok: headers.get("authorization") === "Bearer request-token",
      };
    };

    const toolkit = new SumUpAgentToolkit({
      apiKey: "default-key",
      configuration: {},
    });

    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    await expect(
      tool.handler({}, { authInfo: { token: "request-token" } }),
    ).resolves.toMatchObject({
      structuredContent: { ok: true },
    });
  });

  test("maps @sumup/sdk APIError(401) with WWW-Authenticate to McpError", async () => {
    mockToolkitState.callback = async () => {
      const response = new Response(
        JSON.stringify({ error: "invalid_token" }),
        {
          status: 401,
          headers: {
            "www-authenticate": 'Bearer error="invalid_token"',
          },
        },
      );

      throw new APIError(401, { error: "invalid_token" }, response);
    };

    const toolkit = new SumUpAgentToolkit({
      resourceMetadata:
        "https://api.sumup.example/.well-known/oauth-protected-resource",
      configuration: {},
    });

    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    await expect(tool.handler({})).rejects.toBeInstanceOf(McpError);

    try {
      await tool.handler({});
    } catch (error) {
      const mcpError = error as McpError;
      const data = mcpError.data as { wwwAuthenticate?: string } | undefined;
      expect(mcpError.code).toBe(ErrorCode.InternalError);
      expect(data?.wwwAuthenticate).toBe(
        'bearer error="invalid_token", resource_metadata="https://api.sumup.example/.well-known/oauth-protected-resource"',
      );
    }
  });
});
