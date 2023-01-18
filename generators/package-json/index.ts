import { promises as fs } from 'fs';
import path from 'path';
import config from '../../config';

interface IPackageJson {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  main: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
  dependencies: Record<string, string>;
  types: string;
}

export async function generate() {
  const packageJson: IPackageJson = {
    name: config.title,
    version: '1.0.0',
    description: '',
    author: 'Marc Erdmann',
    license: 'ISC',
    main: 'dist/client.js',
    types: 'dist/client.d.ts',
    scripts: {
      build: 'tsc',
      prepare: 'tsc',
    },
    devDependencies: {
      '@types/lodash': '^4.14.186',
    },
    dependencies: {
      agentkeepalive: '^4.2.1',
      axios: '1.1.2',
      'browser-or-node': '^2.0.0',
      lodash: '^4.17.21',
      qs: '^6.11.0',
      mongoose: '^6.6.5',
    },
  };

  return fs.writeFile(path.resolve(config['output-folder'], './package.json'), JSON.stringify(packageJson, null, 2), {
    flag: 'w',
  });
}
