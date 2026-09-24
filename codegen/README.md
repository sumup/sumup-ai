# Agent toolkit code generation

Run `npm run generate` to generate tools from SumUp's OpenAPI specs.

Run `npm test`, `npm run typecheck`, and `npm run lint` to validate changes.

Descriptions come from the owning OpenAPI specification.

`src/annotations.ts` records reviewed tool behavior, including optional modes. Generation rejects operations without a classification or with a changed read/write method.

To omit an operation entirely from the toolkit, add its OpenAPI `operationId` to `src/exclusions.ts` and regenerate. Exclusions remove tool implementations, parameter/result schemas, exports, and tool names from the registry.
