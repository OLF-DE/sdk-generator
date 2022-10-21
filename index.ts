#!/usr/bin/env node

import _ from 'lodash';
import config from './config';
import * as generators from './generators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { bundle } = require('@apidevtools/swagger-cli');

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

type HttpMethod = typeof HTTP_METHODS[number];

export interface IOperation {
  id: string;
  summary: string;
  description: string;
  path: string;
  method: HttpMethod;
}

function isHttpMethod(method: string): method is HttpMethod {
  return HTTP_METHODS.includes(method as HttpMethod);
}

function generateJSONPaths(spec: Record<string, unknown>): Record<string, Array<string>> {
  switch (spec.type) {
    case 'object':
      break;
    case 'array':
      break;
    case 'string':
      break;
    case 'number':
      break;
  }
}

async function main() {
  const openApiSpec = JSON.parse(
    await bundle(config['input-file'], {
      dereference: true,
    })
  );

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

      /* START FEATURE: SerDes */
      const jsonPathsByStatusAndFormat: Record<string, Record<string, Array<string>>> = {};
      for (const [status, responseSpec] of Object.entries(operationSpec.responses)) {
        const responseContentSpec = _.get(responseSpec, 'content.application/json.schema');

        const jsonPathsByFormat = generateJSONPaths(responseContentSpec);
        jsonPathsByStatusAndFormat[status] = jsonPathsByFormat;
        console.log(jsonPathsByFormat);
      }
      /* END FEATURE: SerDes */

      const operation = {
        id: operationSpec.operationId,
        summary: operationSpec.summary,
        description: operationSpec.description,
        path,
        method,
      };

      operations[operation.id] = operation;
    }
  }

  await generators.axiosConfigTs.generate();
  await generators.clientTs.generate(Object.values(operations));
  await generators.mapperTs.generate();
  await generators.packageJson.generate();
}

if (require.main === module) {
  main();
}
