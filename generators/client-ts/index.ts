import { promises as fs } from 'fs';
import path from 'path';
import { template as compile } from 'lodash';
import { format } from 'prettier';
import config from '../../config';
import type { IOperation } from '../..';

export async function generate(operations: Array<IOperation>) {
  let fileContent = '';
  const header = await fs.readFile(path.resolve(__dirname, './header.ts.txt'), { encoding: 'utf-8' });
  fileContent = fileContent.concat(header);

  const template = await fs.readFile(path.resolve(__dirname, './operation.ts.txt'), { encoding: 'utf-8' });
  const compiled = compile(template);

  for (const operation of operations) {
    fileContent = fileContent.concat(
      compiled({
        id: operation.id,
        description: operation.description ?? operation.summary ?? '',
        method: operation.method,
        path: operation.path.replace(/\{(.*)\}/, '$${config?.params?.$1}'),
        params: '',
      })
    );
  }

  fileContent = fileContent.concat('}');
  console.log("before Prettier", fileContent);
  fileContent = format(fileContent, { parser: 'typescript' });
  console.log("after Prettier", fileContent);
  await fs.writeFile(path.resolve(config['output-folder'], './client.ts'), fileContent, {
    flag: 'w',
  });
}
