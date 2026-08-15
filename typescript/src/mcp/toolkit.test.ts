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
        annotations?: {
          oauthScopes?: string[];
          readOnly?: boolean;
        };
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
        annotations: {
          oauthScopes: ["mock.read", "mock.write"],
          readOnly: true,
        },
        callback: async (sumup: SumUp) => mockToolkitState.callback(sumup),
      });
      reg({
        name: "mutating_tool",
        title: "Mutating tool",
        description: "Mock mutating tool for catalog filtering tests",
        parameters: z.object({}),
        result: z.object({
          ok: z.boolean(),
        }),
        annotations: {
          oauthScopes: ["mock.write"],
          readOnly: false,
        },
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

  test("exposes OAuth scopes in MCP tool metadata", () => {
    const toolkit = new SumUpAgentToolkit({
      configuration: {},
    });

    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    expect(tool._meta).toEqual({
      "com.sumup/oauth-scopes": ["mock.read", "mock.write"],
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

describe("mcp toolkit catalog configuration", () => {
  const registeredTools = (toolkit: SumUpAgentToolkit) =>
    Object.keys(
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools,
    );

  test("omits output schemas by default while retaining result validation", async () => {
    mockToolkitState.callback = async () => ({ ok: true });
    const toolkit = new SumUpAgentToolkit({ configuration: {} });
    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    expect(tool.outputSchema).toBeUndefined();
    await expect(tool.handler({})).resolves.toMatchObject({
      structuredContent: { ok: true },
      content: [{ text: '{"ok":true}' }],
    });

    mockToolkitState.callback = async () =>
      ({ ok: "invalid" }) as unknown as { ok: boolean };
    await expect(tool.handler({})).rejects.toThrow();
  });

  test("can opt in to advertised output schemas", () => {
    const toolkit = new SumUpAgentToolkit({
      configuration: {},
      includeOutputSchemas: true,
    });
    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    expect(tool.outputSchema).toBeDefined();
  });

  test("supports include and exclude filters", () => {
    const included = new SumUpAgentToolkit({
      configuration: {},
      includeTools: ["mock_tool"],
    });
    const excluded = new SumUpAgentToolkit({
      configuration: {},
      excludeTools: ["mutating_tool"],
    });

    expect(registeredTools(included)).toEqual(["mock_tool"]);
    expect(registeredTools(excluded)).toEqual(["mock_tool"]);
  });

  test("can expose only read-only tools", () => {
    const toolkit = new SumUpAgentToolkit({
      configuration: {},
      readOnly: true,
    });

    expect(registeredTools(toolkit)).toEqual(["mock_tool"]);
  });
});
