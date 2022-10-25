#!/usr/bin/env node

import fs from 'fs';
import * as url from 'url';
import path from 'path';
import yaml from 'yaml';

const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));

async function main() {
  const configFileContents = fs.readFileSync('./generator.yml', {
    encoding: 'utf-8',
  });
  const config = yaml.parse(configFileContents);

  const { default: openapiTS } = await import('openapi-typescript');
  const importsHeader = fs.readFileSync(path.resolve(__dirname, './imports.header.ts.txt'), 'utf8');

  const output = await openapiTS(config['input-file'].toString(), {
    defaultNonNullable: true,
  });

  if (!fs.existsSync(config['output-folder'])) {
    fs.mkdirSync(config['output-folder']);
  }

  fs.writeFileSync(path.resolve(config['output-folder'], './openapi.ts'), importsHeader, { flag: 'w' });
  fs.writeFileSync(path.resolve(config['output-folder'], './openapi.ts'), output, { flag: 'a' });
}

main();
