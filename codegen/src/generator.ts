import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { camelCase, kebabCase, snakeCase } from "change-case";
import { OpenAPIV3, type OpenAPIV3_1 } from "openapi-types";
import { format } from "prettier";
import { formatPropertyKey, toTemplateLiteral } from "./utils";
import { collectObjectFields, type ObjectField, schemaToZod } from "./zod";

type NormalizedField = ObjectField & {
  originalName: string;
  description?: string;
  location?: "path" | "query" | "body";
};

type OperationDetails = {
  tag: string;
  path: string;
  method: string;
  operationId: string;
  summary: string;
  description: string;
  sdkMethod: string;
  toolConst: string;
  toolName: string;
  paramConst: string;
  resultConst: string;
  pathParams: NormalizedField[];
  queryParams: NormalizedField[];
  bodyFields: NormalizedField[];
  bodyDescription?: string;
  responses?: OpenAPIV3_1.ResponsesObject;
  oauthScopes: string[];
};

export type CodegenOptions = {
  outputDir: string;
  excludeOperationIds?: string[];
};

const HTTP_METHODS = [
  OpenAPIV3.HttpMethods.GET,
  OpenAPIV3.HttpMethods.POST,
  OpenAPIV3.HttpMethods.PUT,
  OpenAPIV3.HttpMethods.PATCH,
  OpenAPIV3.HttpMethods.DELETE,
];

export async function generate(
  spec: OpenAPIV3_1.Document,
  options: CodegenOptions,
) {
  const excludedOperationIds = new Set(options.excludeOperationIds ?? []);
  const operationsByTag = collectOperations(spec, excludedOperationIds);
  if (!operationsByTag) {
    return;
  }

  const entries = Array.from(operationsByTag.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const generatedTagDirs = new Set(entries.map(([tag]) => kebabCase(tag)));

  cleanupStaleGeneratedTagDirs(options.outputDir, generatedTagDirs);

  for (const [tag, operations] of entries) {
    const tagDir = resolve(options.outputDir, kebabCase(tag));
    mkdirSync(tagDir, { recursive: true });
    await writeParametersFile(tagDir, operations);
    await writeToolsFile(tagDir, operations, tag);
    await writeIndexFile(tagDir, operations);
  }
}

function cleanupStaleGeneratedTagDirs(
  outputDir: string,
  generatedTagDirs: Set<string>,
) {
  for (const entry of readdirSync(outputDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (generatedTagDirs.has(entry.name)) {
      continue;
    }

    const dirPath = resolve(outputDir, entry.name);
    const filenames = new Set(readdirSync(dirPath));
    const looksGenerated =
      filenames.has("index.ts") &&
      filenames.has("parameters.ts") &&
      filenames.has("tools.ts");

    if (looksGenerated) {
      rmSync(dirPath, { recursive: true, force: true });
    }
  }
}

function collectOperations(
  spec: OpenAPIV3_1.Document,
  excludedOperationIds: Set<string>,
) {
  const map = new Map<string, OperationDetails[]>();

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    if (!pathItem) continue;

    const sharedParams = pathItem.parameters ?? [];

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) {
        continue;
      }

      if ("$ref" in operation) {
        continue;
      }

      if (
        !operation.operationId ||
        !operation.tags ||
        operation.tags.length === 0
      ) {
        continue;
      }

      if (operation.deprecated) {
        continue;
      }

      const tag = operation.tags[0]!;
      const operationId = operation.operationId;
      if (excludedOperationIds.has(operationId)) {
        continue;
      }
      const description = (operation.description ?? "").trim();
      const summary = (operation.summary ?? "").trim();

      const nameOverride =
        typeof (operation as Record<string, unknown>)["x-codegen"] === "object"
          ? // biome-ignore lint/suspicious/noExplicitAny: necessary
            ((operation as Record<string, any>)["x-codegen"]?.method_name as
              | string
              | undefined)
          : undefined;
      const sdkMethod = camelCase(nameOverride ?? operationId);
      const toolConst = camelCase(operationId);
      const paramConst = `${toolConst}Parameters`;
      const resultConst = `${toolConst}Result`;
      const toolName = snakeCase(operationId);

      const allParams = [
        ...sharedParams,
        ...(operation.parameters ?? []),
      ] as OpenAPIV3_1.ParameterObject[];
      const normalized = normalizeParameters(allParams);

      const pathParams = normalized.filter(
        (param) => param.location === "path",
      );
      const queryParams = normalized.filter(
        (param) => param.location === "query",
      );

      const { bodyFields, bodyDescription } = normalizeRequestBody(
        operation.requestBody as OpenAPIV3_1.RequestBodyObject | undefined,
      );

      const details: OperationDetails = {
        tag,
        path,
        method,
        operationId,
        summary,
        description,
        sdkMethod,
        toolConst,
        toolName,
        paramConst,
        resultConst,
        pathParams,
        queryParams,
        bodyFields,
        bodyDescription,
        responses: operation.responses,
        oauthScopes: collectOAuthScopes(spec, operation),
      };

      const existing = map.get(tag);
      if (existing) {
        existing.push(details);
      } else {
        map.set(tag, [details]);
      }
    }
  }

  for (const [, list] of map) {
    list.sort((a, b) => a.operationId.localeCompare(b.operationId));
  }

  return map;
}

function collectOAuthScopes(
  spec: OpenAPIV3_1.Document,
  operation: OpenAPIV3_1.OperationObject,
) {
  const securityRequirements = operation.security ?? spec.security ?? [];
  const scopes = new Set<string>();

  for (const requirement of securityRequirements) {
    for (const [schemeName, schemeScopes] of Object.entries(requirement)) {
      if (!Array.isArray(schemeScopes)) {
        continue;
      }

      const scheme = spec.components?.securitySchemes?.[schemeName];
      if (
        scheme &&
        !("$ref" in scheme) &&
        scheme.type !== "oauth2" &&
        scheme.type !== "openIdConnect"
      ) {
        continue;
      }

      for (const scope of schemeScopes) {
        if (typeof scope === "string" && scope.length > 0) {
          scopes.add(scope);
        }
      }
    }
  }

  return Array.from(scopes).sort((a, b) => a.localeCompare(b));
}

function normalizeParameters(params: OpenAPIV3_1.ParameterObject[]) {
  const seen = new Map<
    string,
    NormalizedField & { location: "path" | "query" }
  >();

  for (const param of params) {
    if (!param || (param.in !== "path" && param.in !== "query")) {
      continue;
    }
    const schema = resolveParameterSchema(param);
    if (!schema) continue;

    const name = param.in === "path" ? camelCase(param.name) : param.name;
    const key = `${param.in}:${name}`;

    if (seen.has(key)) {
      continue;
    }

    seen.set(key, {
      name,
      originalName: param.name,
      schema: schema as OpenAPIV3_1.SchemaObject,
      required: param.required ?? param.in === "path",
      description: param.description,
      location: param.in,
    });
  }

  return Array.from(seen.values());
}

function resolveParameterSchema(param: OpenAPIV3_1.ParameterObject) {
  if (param.schema) {
    return param.schema as OpenAPIV3_1.SchemaObject;
  }

  const content = param.content ?? {};
  const first = content["application/json"] ?? Object.values(content)[0];
  return first?.schema as OpenAPIV3_1.SchemaObject | undefined;
}

function normalizeRequestBody(requestBody?: OpenAPIV3_1.RequestBodyObject) {
  if (!requestBody || !requestBody.content) {
    return { bodyFields: [], bodyDescription: undefined };
  }

  const jsonContent =
    requestBody.content["application/json"] ??
    requestBody.content["application/x-www-form-urlencoded"] ??
    Object.values(requestBody.content)[0];

  const schema = jsonContent?.schema as OpenAPIV3_1.SchemaObject | undefined;
  if (!schema) {
    return { bodyFields: [], bodyDescription: undefined };
  }

  const fields = collectObjectFields(schema).map((field) => ({
    ...field,
    originalName: field.name,
  }));

  return {
    bodyFields: fields,
    bodyDescription: schema.description?.trim(),
  };
}

async function writeParametersFile(
  dir: string,
  operations: OperationDetails[],
) {
  const parts: string[] = [`import { z } from "zod";`, ""];

  for (const operation of operations) {
    parts.push(
      `export const ${operation.paramConst} = ${buildParameterSchema(operation)};`,
      "",
    );
    parts.push(
      `export const ${operation.resultConst} = ${buildResultSchema(operation)};`,
      "",
    );
  }

  const content = await format(parts.join("\n").trimEnd(), {
    parser: "typescript",
  });
  writeFileSync(join(dir, "parameters.ts"), `${content}\n`);
}

function buildParameterSchema(operation: OperationDetails) {
  const fields = [
    ...operation.pathParams,
    ...operation.queryParams,
    ...operation.bodyFields,
  ];
  const shape: string[] = [];

  for (const field of fields) {
    const schemaResult = schemaToZod(field.schema);
    let expr = schemaResult.code;
    if (!field.required) {
      expr += ".optional()";
    }

    if (!schemaResult.hasDescription && field.description) {
      expr += `.describe(${toTemplateLiteral(field.description)})`;
    }

    shape.push(`${formatPropertyKey(field.name)}: ${expr}`);
  }

  let expression = `z.object({${shape.length > 0 ? `\n  ${shape.join(",\n  ")}\n` : ""}})`;

  if (operation.bodyDescription) {
    expression += `.describe(${toTemplateLiteral(operation.bodyDescription)})`;
  }

  return expression;
}

function buildResultSchema(operation: OperationDetails) {
  const responses = operation.responses ?? operation.responses;
  if (!responses || typeof responses !== "object") {
    return "z.any()";
  }

  // Collect all 2xx responses
  const successEntries = Object.entries(responses)
    .filter(([code]) => /^2\d\d$/.test(code))
    .sort(([a], [b]) => a.localeCompare(b));

  // If no explicit 2xx, fall back to the first response if present
  const [, responseObj] =
    successEntries[0] ?? Object.entries(responses)[0] ?? [];

  if (!responseObj || typeof responseObj !== "object") {
    return "z.any()";
  }

  const resp = responseObj as OpenAPIV3_1.ResponseObject;
  const content = resp.content;
  if (!content || typeof content !== "object") {
    return "z.any()";
  }

  // Prioritize JSON types, fall back to first available
  const json =
    content["application/json"] ??
    content["application/*+json"] ??
    Object.values(content)[0];

  if (!json || !json.schema) {
    return "z.any()";
  }

  const schema = json.schema as OpenAPIV3_1.SchemaObject;
  const schemaResult = schemaToZod(schema, {
    allowNullableAdditionalProperties: true,
    looseEmptyObject: true,
    passthroughObjects: true,
  });

  let expr = schemaResult.code;

  // Add description if the schema did not already include one
  if (!schemaResult.hasDescription && typeof resp.description === "string") {
    expr += `.describe(${toTemplateLiteral(resp.description.trim())})`;
  }

  return expr;
}

async function writeToolsFile(
  dir: string,
  operations: OperationDetails[],
  tag: string,
) {
  const resourceProperty = camelCase(tag);
  const paramImports = operations.map((op) => op.paramConst).join(",\n  ");
  const resultImports = operations.map((op) => op.resultConst).join(",\n  ");

  const parts: string[] = [
    `import type SumUp from "@sumup/sdk";`,
    `import type { Tool } from "../types";`,
    "",
    `import {`,
    `  ${paramImports},`,
    `  ${resultImports}`,
    `} from "./parameters";`,
    "",
  ];

  for (const operation of operations) {
    const pathNames = operation.pathParams.map((param) => param.name);
    const hasPathParams = pathNames.length > 0;
    const destructured = hasPathParams
      ? `{ ${pathNames.join(", ")}, ...args }`
      : "args";
    const callArgs = [...pathNames, "args"];
    const description = operation.description
      ? toTemplateLiteral(operation.description)
      : "`No description provided.`";

    parts.push(
      `export const ${operation.toolConst}: Tool<typeof ${operation.paramConst}, typeof ${operation.resultConst}> = {`,
      `  name: ${JSON.stringify(operation.toolName)},`,
      `  title: ${toTemplateLiteral(operation.summary)},`,
      `  description: ${description},`,
      `  parameters: ${operation.paramConst},`,
      `  result: ${operation.resultConst},`,
      `  callback: async (`,
      `    sumup: SumUp,`,
      `    ${destructured},`,
      `  ) => {`,
      `    return await sumup.${resourceProperty}.${operation.sdkMethod}(${callArgs.join(", ")});`,
      `  },`,
      `  annotations: {`,
      `    title: ${toTemplateLiteral(operation.summary)},`,
      `    readOnly: ${operation.method === OpenAPIV3.HttpMethods.GET},`,
      `    destructive: ${operation.method === OpenAPIV3.HttpMethods.DELETE},`,
      `    idempotent: ${operation.method === OpenAPIV3.HttpMethods.PUT},`,
      `    oauthScopes: [${operation.oauthScopes.map((scope) => JSON.stringify(scope)).join(", ")}],`,
      `  },`,
      `};`,
      "",
    );
  }

  const content = await format(parts.join("\n").trimEnd(), {
    parser: "typescript",
  });
  writeFileSync(join(dir, "tools.ts"), `${content}\n`);
}

async function writeIndexFile(dir: string, operations: OperationDetails[]) {
  const params = operations.map((op) => op.paramConst).join(",\n  ");
  const tools = operations.map((op) => op.toolConst).join(",\n  ");

  const code = [
    `export {`,
    `  ${params}`,
    `} from "./parameters";`,
    `export {`,
    `  ${tools}`,
    `} from "./tools";`,
  ].join("\n");

  const content = await format(code, { parser: "typescript" });
  writeFileSync(join(dir, "index.ts"), `${content}\n`);
}
