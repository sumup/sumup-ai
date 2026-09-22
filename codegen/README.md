# Agent toolkit code generation

Run `npm run generate` to generate tools from `../../apis/specs/openapi.json`.
Run `npm test`, `npm run typecheck`, and `npm run lint` to validate changes.

Descriptions come from the owning OpenAPI specification. Edit checkout descriptions
in `apis/specs/base.yaml`; member, role, and reader descriptions originate in
Portier's public API specifications. Regenerate their bundles and the public
`apis` specifications before regenerating the toolkit. Keep API descriptions
applicable to SDKs and the developer portal.

`src/annotations.ts` records reviewed tool behavior, including optional modes.
Generation rejects operations without a classification or with a changed
read/write method. Review the implementation when adding an operation: writes
can send invitations, initiate payments, replace data, or revoke access without
using HTTP DELETE. Invitation emails and external callbacks affect the
open-world classification; financial changes within SumUp alone do not. These
annotations describe behavior; they do not enforce user confirmation in an MCP
client.
