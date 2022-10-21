import { JSONPath } from 'jsonpath-plus';

interface IRule {
  path: string;
  transform: (o: unknown) => unknown;
}

export function deserialize(o: Record<string, any>, rules: IRule[]) {
  for (const rule of rules) {
    JSONPath({
      path: rule.path,
      json: o,
      callback: (value, _type, ref) => {
        ref.parent[ref.parentProperty] = rule.transform(value);
      },
    });
  }

  return o;
}
