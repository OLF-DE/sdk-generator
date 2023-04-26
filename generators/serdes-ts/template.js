"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = void 0;
const jsonpath_plus_1 = require("jsonpath-plus");
function deserialize(o, rules) {
    for (const rule of rules) {
        (0, jsonpath_plus_1.JSONPath)({
            path: rule.path,
            json: o,
            callback: (value, _type, ref) => {
                ref.parent[ref.parentProperty] = rule.transform(value);
            },
        });
    }
    return o;
}
exports.deserialize = deserialize;
