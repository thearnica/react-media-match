import {MediaRulesOf, ObjectOf, BoolOf} from "./types";

export function forEachName<T, K, R = { [key in keyof T]: K }>
(object: MediaRulesOf<T>, map: (key: string) => K): R {
  return Object
    .keys(object)
    .map(key => ({key, value: map(key)}))
    .reduce((acc: any, line): R => ({
      ...acc,
      [line.key]: line.value
    }), {})
}

export function getMaxMatch<T>(mediaRules: MediaRulesOf<T>, matches: BoolOf<any>): string {
  const keys = Object.keys(mediaRules);
  const len = keys.length;

  let index = 0;
  for (; index < len; index++) {
    if (matches[keys[index]]) {
      break;
    }
  }

  return keys[index];
}

export function pickMediaMatch<T, K>
(mediaRules: MediaRulesOf<T>, matches: BoolOf<any>, slots: Partial<ObjectOf<any, K>>): K | null {
  const keys = Object.keys(mediaRules);
  const len = keys.length;

  let index = 0;
  for (; index < len; index++) {
    if (matches[keys[index]]) {
      break;
    }
  }

  for (; index >= 0; index--) {
    const value = slots[keys[index]];
    if (value !== undefined) {
      return value;
    }
  }

  return null;
}

export type Names = {
  [key: string]: any;
}

export function pickMatchValues(points: Names, props: Names) {
  return Object
    .keys(props)
    .reduce((acc: any, key: string) => {
      if (points[key] !== undefined) {
        acc[key] = props[key];
      }
      return acc;
    }, {})
}

export function inBetween(breakPoints: Names, points: any, value: any, invert: boolean) {
  let pass = false;
  return Object
    .keys(breakPoints)
    .reduce((acc: any, key: string) => {
      if (invert && points[key]) {
        pass = true;
      }
      acc[key] = (invert ? pass : !pass) ? null : value;
      if (!invert && points[key]) {
        pass = true;
      }
      return acc;
    }, {})
}

export function notNulls(matches: { [key: string]: boolean | undefined }): { [key: string]: boolean | undefined } {
  return Object
    .keys(matches)
    .reduce((acc: any, key) => {
      if (matches[key] !== undefined) {
        acc[key] = matches[key]
      }

      return acc;
    }, {})
}