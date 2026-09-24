#!/usr/bin/env node

import path from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { program } from "commander";
import type { OpenAPIV3_1 } from "openapi-types";
import { generate } from "./generator.js";

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
      await generate(specs, {
        outputDir,
        excludeOperationIds: options.exclude,
      });
    },
  );

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
