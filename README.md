<div align="center">

# SumUp AI

Enable AI Agents to interact with SumUp for smarter payment workflows.

[![Documentation][docs-badge]](https://developer.sumup.com)
[![License](https://img.shields.io/github/license/sumup/sumup-ai)](./LICENSE)

</div>

SumUp AI toolkit contains collections of SDKs for building AI-enhanced applications integrated with SumUp. You can build payments processing solutions, reporting, and much more with the AI toolkit.

## Model Context Protocol

SumUp hosts a [Model Context Protocol (MCP)](https://modelcontextprotocol.com/) at `https://mcp.sumup.com`, for more details see [sumup/sumup-mcp](https://github.com/sumup/sumup-mcp).

You can also run SumUp MCP server locally:

```sh
SUMUP_API_KEY=YOUR_SUMUP_API_KEY npx -y @sumup/mcp
```

For more information, see [MCP installation instruction](/mcp/README.md#installation).

## Agent Toolkit

SumUp provides a TypeScript SDK to AI agents, see [SumUp Agent Toolkit (Typescript)](typescript/README.md). To get started:

```sh
npm install @sumup/agent-toolkit
```

[docs-badge]: https://img.shields.io/badge/SumUp-documentation-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY29sb3I9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTIyLjI5IDBIMS43Qy43NyAwIDAgLjc3IDAgMS43MVYyMi4zYzAgLjkzLjc3IDEuNyAxLjcxIDEuN0gyMi4zYy45NCAwIDEuNzEtLjc3IDEuNzEtMS43MVYxLjdDMjQgLjc3IDIzLjIzIDAgMjIuMjkgMFptLTcuMjIgMTguMDdhNS42MiA1LjYyIDAgMCAxLTcuNjguMjQuMzYuMzYgMCAwIDEtLjAxLS40OWw3LjQ0LTcuNDRhLjM1LjM1IDAgMCAxIC40OSAwIDUuNiA1LjYgMCAwIDEtLjI0IDcuNjlabTEuNTUtMTEuOS03LjQ0IDcuNDVhLjM1LjM1IDAgMCAxLS41IDAgNS42MSA1LjYxIDAgMCAxIDcuOS03Ljk2bC4wMy4wM2MuMTMuMTMuMTQuMzUuMDEuNDlaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+
