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
const lodash_1 = require("lodash");
const prettier_1 = require("prettier");
const config_1 = __importDefault(require("../../config"));
function generate(operations) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let fileContent = '';
        const header = yield fs_1.promises.readFile(path_1.default.resolve(__dirname, './header.ts.txt'), { encoding: 'utf-8' });
        fileContent = fileContent.concat(header);
        const template = yield fs_1.promises.readFile(path_1.default.resolve(__dirname, './operation.ts.txt'), { encoding: 'utf-8' });
        const compiled = (0, lodash_1.template)(template);
        for (const operation of operations) {
            fileContent = fileContent.concat(compiled({
                id: operation.id,
                description: (_b = (_a = operation.description) !== null && _a !== void 0 ? _a : operation.summary) !== null && _b !== void 0 ? _b : '',
                method: operation.method,
                path: operation.path.replace(/\{(.*)\}/, '$${config?.params?.$1}'),
                params: '',
            }));
        }
        fileContent = fileContent.concat('}');
        fileContent = (0, prettier_1.format)(fileContent, { parser: 'typescript' });
        yield fs_1.promises.writeFile(path_1.default.resolve(config_1.default['output-folder'], './client.ts'), fileContent, {
            flag: 'w',
        });
    });
}
exports.generate = generate;
