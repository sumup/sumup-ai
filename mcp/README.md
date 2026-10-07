<div align="center">

# SumUp Model Context Protocol (MCP) Server

![MCP SumUp](https://img.shields.io/badge/MCP-SumUp-blue)
[![NPM Version](https://img.shields.io/npm/v/@sumup/mcp.svg)](https://www.npmjs.com/package/@sumup/mcp)
[![Documentation][docs-badge]](https://developer.sumup.com)
[![License](https://img.shields.io/github/license/sumup/sumup-ai)](../LICENSE)

</div>

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is a [standardized protocol](https://modelcontextprotocol.io/introduction) designed to manage context between large language models (LLMs) and external systems.

## Prerequisites

The SumUp Model Context Protocol (MCP) Server requires Node.js 22 or later and a [SumUp API key](https://developer.sumup.com/tools/authorization/api-keys/).

## Hosted server and plugins

For an OAuth connection managed by SumUp, use `https://mcp.sumup.com/mcp`. To get both integration skills and hosted MCP configuration, [install the SumUp plugin](https://developer.sumup.com/tools/llms/plugins/). For direct hosted setup, see the [MCP guide](https://developer.sumup.com/tools/llms/mcp-server/).

This package runs locally over stdio and reads its API key from `SUMUP_API_KEY`. Use the local instructions below when your client launches MCP processes or your workflow needs API-key authentication.

## Setup

To run the SumUp Model Context Protocol (MCP) Server using [Node.js npx](https://docs.npmjs.com/cli/v10/commands/npx), use the following command:

```sh
SUMUP_API_KEY='sup_sk_...' npx -y @sumup/mcp
```

## Installation

Keep API keys in your client's private configuration and out of shared project files.

### [Codex](https://developers.openai.com/codex/)

Add the following configuration to your `~/.codex/config.toml` file, replacing `sup_sk_...` with your SumUp API key:

```toml
[mcp_servers.sumup]
command = "npx"
args = ["-y", "@sumup/mcp"]

[mcp_servers.sumup.env]
SUMUP_API_KEY = "sup_sk_..."
```

Alternatively, add the server using the Codex CLI:

```sh
codex mcp add sumup --env SUMUP_API_KEY=sup_sk_... -- npx -y @sumup/mcp
```

Run `codex mcp list` to verify the server is configured, or use `/mcp` in a Codex session to see active servers.

See the [official OpenAI documentation](https://developers.openai.com/codex/mcp) for more details.

### [Cursor](https://www.cursor.com/)

1. Go to `Cursor Settings` > `MCP`
2. Click `+ Add new Global MCP Server`
3. Add the following configuration to your global `.cursor/mcp.json` file.

```json
{
  "mcpServers": {
    "sumup": {
      "command": "npx",
      "args": [
          "-y",
          "@sumup/mcp"
      ],
      "env": {
      	"SUMUP_API_KEY": "sup_sk_..."
      }
    }
  }
}
```

See the [Cursor documentation](https://docs.cursor.com/context/model-context-protocol) for more details. Note: You can also add this to your project specific cursor configuration. (Supported in Cursor 0.46+)

### [Claude](https://claude.ai)

Add the following to your `claude_desktop_config.json` file. See the [Claude Desktop documentation](https://modelcontextprotocol.io/quickstart/user) for more details.

```json
{
  "mcpServers": {
    "sumup": {
      "command": "npx",
      "args": [
          "-y",
          "@sumup/mcp"
      ],
      "env": {
      	"SUMUP_API_KEY": "sup_sk_..."
      }
    }
  }
}
```

[docs-badge]: https://img.shields.io/badge/SumUp-documentation-white.svg?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY29sb3I9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPHBhdGggZD0iTTIyLjI5IDBIMS43Qy43NyAwIDAgLjc3IDAgMS43MVYyMi4zYzAgLjkzLjc3IDEuNyAxLjcxIDEuN0gyMi4zYy45NCAwIDEuNzEtLjc3IDEuNzEtMS43MVYxLjdDMjQgLjc3IDIzLjIzIDAgMjIuMjkgMFptLTcuMjIgMTguMDdhNS42MiA1LjYyIDAgMCAxLTcuNjguMjQuMzYuMzYgMCAwIDEtLjAxLS40OWw3LjQ0LTcuNDRhLjM1LjM1IDAgMCAxIC40OSAwIDUuNiA1LjYgMCAwIDEtLjI0IDcuNjlabTEuNTUtMTEuOS03LjQ0IDcuNDVhLjM1LjM1IDAgMCAxLS41IDAgNS42MSA1LjYxIDAgMCAxIDcuOS03Ljk2bC4wMy4wM2MuMTMuMTMuMTQuMzUuMDEuNDlaIiBmaWxsPSJjdXJyZW50Q29sb3IiLz4KPC9zdmc+
