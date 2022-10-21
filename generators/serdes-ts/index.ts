import { promises as fs } from 'fs';
import path from 'path';
import config from '../../config';

export async function generate() {
  const template = await fs.readFile(path.resolve(__dirname, './template.ts.txt'), { encoding: 'utf-8' });

  return fs.writeFile(path.resolve(config['output-folder'], './serdes.ts'), template, {
    flag: 'w',
  });
}
