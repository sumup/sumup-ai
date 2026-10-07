<div align="center">

# SumUp AI

Enable AI Agents to interact with SumUp for smarter payment workflows.

[![Documentation][docs-badge]](https://developer.sumup.com)
[![License](https://img.shields.io/github/license/sumup/sumup-ai)](./LICENSE)

</div>

SumUp AI toolkit contains collections of SDKs for building AI-enhanced applications integrated with SumUp. You can build payments processing solutions, reporting, and much more with the AI toolkit.

## Set up an AI coding assistant

Install the [SumUp plugin](https://github.com/sumup/sumup-skills) to get payment integration skills and hosted MCP configuration. For Codex:

```sh
codex plugin marketplace add sumup/sumup-skills
codex plugin add sumup@sumup
codex plugin list
```

Start a new session and sign in with SumUp when prompted to use account tools. For Claude Code, Cursor, Gemini CLI, and Kiro instructions, see the [plugin setup guide](https://developer.sumup.com/tools/llms/plugins/).

## Model Context Protocol

SumUp hosts a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server at `https://mcp.sumup.com/mcp`. Connect an OAuth-capable client and sign in with SumUp; hosted connections do not use SumUp API keys. For direct client configuration, see the [MCP setup guide](https://developer.sumup.com/tools/llms/mcp-server/) or [sumup/sumup-mcp](https://github.com/sumup/sumup-mcp).

You can also run the SumUp MCP server locally with Node.js 22 or later and a SumUp API key:

```sh
SUMUP_API_KEY='sup_sk_...' npx -y @sumup/mcp
```

For more information, see [local MCP installation instructions](mcp/README.md#installation).

## Agent Toolkit

SumUp provides a TypeScript SDK to AI agents, see [SumUp Agent Toolkit (Typescript)](typescript/README.md). To get started:

```sh
npm install @sumup/agent-toolkit
```

[docs-badge]: https://img.shields.io/badge/SumUp-documentation-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY29sb3I9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTIyLjI5IDBIMS43Qy43NyAwIDAgLjc3IDAgMS43MVYyMi4zYzAgLjkzLjc3IDEuNyAxLjcxIDEuN0gyMi4zYy45NCAwIDEuNzEtLjc3IDEuNzEtMS43MVYxLjdDMjQgLjc3IDIzLjIzIDAgMjIuMjkgMFptLTcuMjIgMTguMDdhNS42MiA1LjYyIDAgMCAxLTcuNjguMjQuMzYuMzYgMCAwIDEtLjAxLS40OWw3LjQ0LTcuNDRhLjM1LjM1IDAgMCAxIC40OSAwIDUuNiA1LjYgMCAwIDEtLjI0IDcuNjlabTEuNTUtMTEuOS03LjQ0IDcuNDVhLjM1LjM1IDAgMCAxLS41IDAgNS42MSA1LjYxIDAgMCAxIDcuOS03Ljk2bC4wMy4wM2MuMTMuMTMuMTQuMzUuMDEuNDlaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+
