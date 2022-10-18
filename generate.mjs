#!/usr/bin/env node

import fs from 'fs';
import * as url from 'url';
import path from 'path';
import yaml from 'yaml';

const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

async function main() {
  const configFileContents = fs.readFileSync('./generator.yml', {
    encoding: 'utf-8',
  });
  const config = yaml.parse(configFileContents);

  const { default: openapiTS } = await import('openapi-typescript');
  const importsHeader = fs.readFileSync(path.resolve(__dirname, './imports.header.ts.txt'), 'utf8');
  const localPath = new url.URL(config['input-file'], 'file://' + __filename);

  const output = await openapiTS(localPath.toString(), {
    defaultNonNullable: true,
  });

  fs.writeFileSync(path.resolve(__dirname, config['output-folder'], './openapi.d.ts'), importsHeader, { flag: 'w' });
  fs.writeFileSync(path.resolve(__dirname, config['output-folder'], './openapi.d.ts'), output, { flag: 'a' });
}

main();
