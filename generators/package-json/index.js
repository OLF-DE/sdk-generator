"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
function generate() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = {
            name: config_1.default.title,
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
                axios: '^1.1.2',
                'browser-or-node': '^2.0.0',
                lodash: '^4.17.21',
                qs: '^6.11.0',
                mongoose: '^6.6.5',
            },
        };
        return fs_1.promises.writeFile(path_1.default.resolve(config_1.default['output-folder'], './package.json'), JSON.stringify(packageJson, null, 2), {
            flag: 'w',
        });
    });
}
exports.generate = generate;
