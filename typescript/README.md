<div align="center">

# SumUp Agent Toolkit - Typescript

Allow LLM agents to integrate with the SumUp API using function calling from frameworks such as [LangChain](https://www.langchain.com/), [AI SDK](https://ai-sdk.dev/), and the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/). For full documentation, see [sumup.github.io/sumup-ai](https://sumup.github.io/sumup-ai/).

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

## [LangChain](https://www.langchain.com/)

```ts
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/langchain";
import { createAgent } from "langchain";

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

const agent = createAgent({
  model: "openai:gpt-4o",
  tools: sumupAgentToolkit.getTools(),
});

const response = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "Tell me about my last 10 transactions please.",
    },
  ],
});
```

## [AI SDK](https://ai-sdk.dev/)

```ts
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/ai";
import { generateText, stepCountIs } from "ai";

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

const response = await generateText({
  model: "openai/gpt-4o",
  tools: sumupAgentToolkit.getTools(),
  stopWhen: stepCountIs(5),
  prompt: "Tell me about my last 10 transactions please.",
});
```

For full example see [AI SDK Example](./examples/ai/).

## [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)

```ts
import { Agent, run } from "@openai/agents";
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/openai";

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

const agent = new Agent({
  name: "Transactions reporter",
  instructions: "You are a helpful payments assistant.",
  tools: sumupAgentToolkit.getTools(),
});

const result = await run(
  agent,
  "Tell me about my last 10 transactions please.",
);

console.log(result.finalOutput);
```

For full example see [OpenAI Example](./examples/openai/).

[docs-badge]: https://img.shields.io/badge/SumUp-documentation-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY29sb3I9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTIyLjI5IDBIMS43Qy43NyAwIDAgLjc3IDAgMS43MVYyMi4zYzAgLjkzLjc3IDEuNyAxLjcxIDEuN0gyMi4zYy45NCAwIDEuNzEtLjc3IDEuNzEtMS43MVYxLjdDMjQgLjc3IDIzLjIzIDAgMjIuMjkgMFptLTcuMjIgMTguMDdhNS42MiA1LjYyIDAgMCAxLTcuNjguMjQuMzYuMzYgMCAwIDEtLjAxLS40OWw3LjQ0LTcuNDRhLjM1LjM1IDAgMCAxIC40OSAwIDUuNiA1LjYgMCAwIDEtLjI0IDcuNjlabTEuNTUtMTEuOS03LjQ0IDcuNDVhLjM1LjM1IDAgMCAxLS41IDAgNS42MSA1LjYxIDAgMCAxIDcuOS03Ljk2bC4wMy4wM2MuMTMuMTMuMTQuMzUuMDEuNDlaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+
