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

  test("does not encode HTTP authentication challenges as tool errors", async () => {
    const response = new Response(JSON.stringify({ error: "invalid_token" }), {
      status: 401,
      headers: {
        "www-authenticate": 'Bearer error="invalid_token"',
      },
    });
    const apiError = new APIError(401, { error: "invalid_token" }, response);
    mockToolkitState.callback = async () => {
      throw apiError;
    };

    const toolkit = new SumUpAgentToolkit({
      configuration: {},
    });

    const tool =
      // biome-ignore lint/suspicious/noExplicitAny: test inspects internal registration
      (toolkit as any)._registeredTools.mock_tool;

    await expect(tool.handler({})).rejects.toBe(apiError);
  });
});
