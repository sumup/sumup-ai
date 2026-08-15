<div align="center">

# SumUp Agent Toolkit - Typescript

Allow LLM agents to integrate with the SumUp API using function calling from frameworks such as [LangChain](https://www.langchain.com/), and [Vercel's AI SDK](https://sdk.vercel.ai/). For full documentation, see [sumup.github.io/sumup-ai](https://sumup.github.io/sumup-ai/).

[![NPM Version](https://img.shields.io/npm/v/@sumup/agent-toolkit.svg)](https://www.npmjs.org/package/@sumup/agent-toolkit)
[![JSR Version](https://jsr.io/badges/@sumup/agent-toolkit)](https://jsr.io/@sumup/agent-toolkit)
[![Documentation][docs-badge]](https://developer.sumup.com)
[![Downloads](https://img.shields.io/npm/dm/@sumup/agent-toolkit.svg)](https://www.npmjs.com/package/@sumup/agent-toolkit)
[![License](https://img.shields.io/github/license/sumup/sumup-ai)](../LICENSE)

</div>

## Install

Install SumUp Agent Toolkit using:

```sh
npm install @sumup/agent-toolkit
# or
yarn add @sumup/agent-toolkit
```

### Remote MCP authentication

When serving the MCP toolkit over HTTP, validate bearer tokens before MCP tool
dispatch and attach the validated token to the request's `authInfo`. Missing or
invalid credentials must produce an HTTP `401` response with a
`WWW-Authenticate` challenge at the transport boundary, as required by the
[MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization).

Do not rely on a downstream SumUp API `401` as an OAuth challenge: by that
point the request is already inside JSON-RPC tool execution and cannot produce
the HTTP response expected by MCP clients.

## [LangChain](https://www.langchain.com/)

```ts
import { SumUpAgentToolkit } from '@sumup/agent-toolkit/langchain';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

const llm = new ChatOpenAI({
  model: 'gpt-4o',
});

const prompt = await pull<ChatPromptTemplate>(
  'hwchase17/structured-chat-agent'
);

const tools = sumupAgentToolkit.getTools();

const agent = await createStructuredChatAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

const response = await agentExecutor.invoke({
  input: "Tell me about my last 10 transactions please.",
});
```

For full example see [Langchain Example](./examples/langchain/).

## [AI SDK](https://sdk.vercel.ai/)

```ts
import { SumUpAgentToolkit } from '@sumup/agent-toolkit/langchain';
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

const model = openai("gpt-4o");

const response = await generateText({
  model: model,
  tools: {
    ...sumupAgentToolkit.getTools(),
  },
  maxSteps: 5,
  prompt: "Tell me about my last 10 transactions please.",
});
```

For full example see [AI SDK Example](./examples/ai/).

## [OpenAI](https://github.com/openai/openai-node)

```ts
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/openai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI();

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

let messages: ChatCompletionMessageParam[] = [
  {
    role: "user",
    content: "Tell me about my last 10 transactions please.",
  },
];

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,
  tools: sumupAgentToolkit.getTools(),
});

const message = completion.choices[0].message;

messages.push(message);

if (message.tool_calls) {
  const toolMessages = await Promise.all(
    message.tool_calls.map((tc) => sumupAgentToolkit.handleToolCall(tc)),
  );
  messages = [...messages, ...toolMessages];
} else {
  console.log(completion.choices[0].message);
  break;
}
```

For full example see [OpenAI Example](./examples/openai/).

[docs-badge]: https://img.shields.io/badge/SumUp-documentation-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY29sb3I9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTIyLjI5IDBIMS43Qy43NyAwIDAgLjc3IDAgMS43MVYyMi4zYzAgLjkzLjc3IDEuNyAxLjcxIDEuN0gyMi4zYy45NCAwIDEuNzEtLjc3IDEuNzEtMS43MVYxLjdDMjQgLjc3IDIzLjIzIDAgMjIuMjkgMFptLTcuMjIgMTguMDdhNS42MiA1LjYyIDAgMCAxLTcuNjguMjQuMzYuMzYgMCAwIDEtLjAxLS40OWw3LjQ0LTcuNDRhLjM1LjM1IDAgMCAxIC40OSAwIDUuNiA1LjYgMCAwIDEtLjI0IDcuNjlabTEuNTUtMTEuOS03LjQ0IDcuNDVhLjM1LjM1IDAgMCAxLS41IDAgNS42MSA1LjYxIDAgMCAxIDcuOS03Ljk2bC4wMy4wM2MuMTMuMTMuMTQuMzUuMDEuNDlaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+
