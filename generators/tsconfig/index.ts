import { promises as fs } from 'fs';
import path from 'path';
import config from '../../config';

interface ITSConfigJSON {
  compilerOptions: {
    incremental: boolean;
    declaration: boolean;
    target: string;
    outDir: string;
    skipLibCheck: boolean;
    forceConsistentCasingInFileNames: boolean;
    module: string;
    esModuleInterop: boolean;
  };
}

export async function generate() {
  const packageJson: ITSConfigJSON = {
    compilerOptions: {
      incremental: true,
      declaration: true,
      target: 'ES2019',
      outDir: 'dist',
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      module: 'CommonJS',
      esModuleInterop: true,
    },
  };

  return fs.writeFile(path.resolve(config['output-folder'], './tsconfig.json'), JSON.stringify(packageJson, null, 2), {
    flag: 'w',
  });
}
