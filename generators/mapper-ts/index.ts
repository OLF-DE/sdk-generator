import { promises as fs } from 'fs';
import path from 'path';
import config from '../../config';

export async function generate() {
  const template = await fs.readFile(path.resolve(__dirname, './template.ts.txt'), { encoding: 'utf-8' });

  return fs.writeFile(path.resolve(__dirname, '../..', config['output-folder'], './mapper.d.ts'), template, {
    flag: 'w',
  });
}
