# Agent toolkit schema generation

Run `npm run generate` to generate Zod parameter and result schemas from SumUp's
OpenAPI specs into `typescript/src/common/generated/`. Only this directory is
generated. Field descriptions and validation constraints come from the specs.

Tool definitions in `typescript/src/common/<resource>/tools.ts` are handwritten
SDK wrappers. Import generated schemas and use Zod's `.pick()`, `.omit()`, or
`.extend()` when a workflow needs a different contract. Keep descriptions,
annotations, OAuth scope metadata, and callbacks accurate for that workflow.
The callback's parameters are inferred from its schema and checked against the
SDK method when calling it; no changes to `@sumup/sdk` are needed.

Register reviewed tools in `typescript/src/common/registry.ts`. `ToolName` is
inferred from that registry, and new API operations only generate schemas;
they do not automatically become tools. The third `Tool` type parameter retains
the literal tool name and checks it against the definition.

`src/exclusions.ts` lists operations whose schemas should not be generated.
Removing an existing tool also requires removing its handwritten wrapper,
exports, and registry entry. Generated-file cleanup never removes handwritten
files; only stale files with the generator's header are deleted.

Run `npm test`, `npm run typecheck`, and `npm run lint` to validate the generator.
After changing tools or schemas, run the toolkit's checks in `typescript/` too.

Curated tool contracts live in handwritten `<resource>/parameters.ts` modules
beside the wrappers. Compose generated schemas there rather than rewriting tools
at registration time; the contracts apply consistently across all adapters.
