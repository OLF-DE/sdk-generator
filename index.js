#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs_1 = require("fs");
const yaml_1 = __importDefault(require("yaml"));
const config_1 = __importDefault(require("./config"));
const generators = __importStar(require("./generators"));
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
function isHttpMethod(method) {
    return HTTP_METHODS.includes(method);
}
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const openApiFileContents = yield fs_1.promises.readFile(config_1.default['input-file'], {
            encoding: 'utf-8',
        });
        const openApiSpec = yaml_1.default.parse(openApiFileContents);
        const operations = {};
        const paths = Object.keys(openApiSpec.paths);
        for (const path of paths) {
            const pathSpec = openApiSpec.paths[path];
            for (const method of Object.keys(pathSpec)) {
                if (!isHttpMethod(method)) {
                    console.error(`Method ${method} is not a valid HTTP method`);
                    continue;
                }
                const operationSpec = pathSpec[method];
                if (!operationSpec.operationId) {
                    console.error(`OperationId is missing for ${method} ${path}`);
                    continue;
                }
                const operation = {
                    id: operationSpec.operationId,
                    summary: operationSpec.summary,
                    description: operationSpec.description,
                    path,
                    method,
                    params: (_a = operationSpec.parameters) === null || _a === void 0 ? void 0 : _a.filter((p) => p.in === 'path'),
                };
                operations[operation.id] = operation;
            }
        }
        yield generators.axiosConfigTs.generate();
        yield generators.clientTs.generate(Object.values(operations));
        yield generators.mapperTs.generate();
        yield generators.packageJson.generate();
        yield generators.tsconfigJson.generate();
    });
}
if (require.main === module) {
    main();
}
