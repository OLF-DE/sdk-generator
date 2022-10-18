import fs from 'fs';
import yaml from 'yaml';

interface IConfig {
  title: string;
  'input-file': string;
  'output-folder': string;
}

const configFileContents = fs.readFileSync('./generator.yml', {
  encoding: 'utf-8',
});

const config = yaml.parse(configFileContents) as IConfig;

export default Object.freeze(config);
