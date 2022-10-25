#!/usr/bin/env node

import { promises as fs } from 'fs';
import yaml from 'yaml';
import config from './config';
import * as generators from './generators';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

type HttpMethod = typeof HTTP_METHODS[number];

export interface IOperation {
  id: string;
  summary: string;
  description: string;
  path: string;
  method: HttpMethod;
  params: Record<string, unknown>;
}

function isHttpMethod(method: string): method is HttpMethod {
  return HTTP_METHODS.includes(method as HttpMethod);
}

async function main() {
  const openApiFileContents = await fs.readFile(config['input-file'], {
    encoding: 'utf-8',
  });
  const openApiSpec = yaml.parse(openApiFileContents);

  const operations: Record<string, IOperation> = {};

  const paths = Object.keys(openApiSpec.paths);
  for (const path of paths) {
    const pathSpec = openApiSpec.paths[path];
    for (const method of Object.keys(pathSpec)) {
      if (!isHttpMethod(method)) {
        console.error(`Method ${method} is not a valid HTTP method`);
        continue;
      }

      const operationSpec = pathSpec[method];
      if (!operationSpec.operationId) {
        console.error(`OperationId is missing for ${method} ${path}`);
        continue;
      }

      const operation = {
        id: operationSpec.operationId,
        summary: operationSpec.summary,
        description: operationSpec.description,
        path,
        method,
        params: operationSpec.parameters?.filter((p: Record<string, unknown>) => p.in === 'path'),
      };

      operations[operation.id] = operation;
    }
  }

  await generators.axiosConfigTs.generate();
  await generators.clientTs.generate(Object.values(operations));
  await generators.mapperTs.generate();
  await generators.packageJson.generate();
  await generators.tsconfigJson.generate();
}

if (require.main === module) {
  main();
}
