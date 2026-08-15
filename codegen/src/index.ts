#!/usr/bin/env node

import path from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { program } from "commander";
import type { OpenAPIV3_1 } from "openapi-types";
import { generate } from "./generator";

const DEFAULT_EXCLUDED_OPERATION_IDS = ["ProcessCheckout"] as const;
const DEFAULT_REGISTRATION_EXCLUSIONS = {
  CreateApplePaySession:
    "The current @sumup/sdk version does not expose createApplePaySession.",
} as const;

program
  .name("agent-toolkit-codegen")
  .description("Generate SumUp Agent Toolkit helpers from an OpenAPI schema.")
  .argument("<specFile>", "Path to the OpenAPI schema file")
  .option(
    "-o, --output <dir>",
    "Directory where the generated files will be written",
    path.resolve(process.cwd(), "../typescript/src/common"),
  )
  .option(
    "-x, --exclude <operationId...>",
    "Operation IDs to exclude from code generation",
  )
  .action(
    async (
      specFile: string,
      options: { output: string; exclude?: string[] },
    ) => {
      const parser = new SwaggerParser();
      const specPath = path.resolve(process.cwd(), specFile);
      const outputDir = path.resolve(process.cwd(), options.output);
      const specs = (await parser.dereference(
        specPath,
      )) as OpenAPIV3_1.Document;
      const excludeOperationIds = Array.from(
        new Set([
          ...DEFAULT_EXCLUDED_OPERATION_IDS,
          ...(options.exclude ?? []),
        ]),
      );
      await generate(specs, {
        outputDir,
        excludeOperationIds,
        registrationExclusions: DEFAULT_REGISTRATION_EXCLUSIONS,
      });
    },
  );

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
