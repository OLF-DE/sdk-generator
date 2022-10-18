"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const configFileContents = fs_1.default.readFileSync('./generator.yml', {
    encoding: 'utf-8',
});
const config = yaml_1.default.parse(configFileContents);
exports.default = Object.freeze(config);
