import { BoolOf, MediaRulesOf, ObjectOf } from './types';

export function forEachName<T, K, R = { [key in keyof T]: K }>(object: MediaRulesOf<T>, map: (key: string) => K): R {
  return Object.keys(object)
    .map((key) => ({ key, value: map(key) }))
    .reduce(
      (acc: any, line): R => ({
        ...acc,
        [line.key]: line.value,
      }),
      {}
    );
}

export function getMaxMatch<T>(mediaRules: MediaRulesOf<T>, matches: Partial<BoolOf<any>>): keyof T {
  const keys = Object.keys(mediaRules) as Array<keyof T>;
  const len = keys.length;

  let index = 0;
  for (; index < len; index++) {
    if (matches[keys[index]]) {
      break;
    }
  }

  return keys[index];
}

function validateSlots(rules: string[], slots: object) {
  if (
    // @ts-ignore
    process.env.NODE_ENV !== 'production'
  ) {
    // validate slots versus rules
    Object.keys(slots).forEach((slotKey) => {
      if (rules.indexOf(slotKey) < 0) {
        throw new Error(
          'react-media-match: used slot [' +
            slotKey +
            '] is not among [' +
            rules.join(',') +
            ']. This is a development error only'
        );
      }
    });
  }
}

export function pickMediaMatchSlot<T, K>(
  mediaRules: MediaRulesOf<T>,
  matches: Partial<BoolOf<any>>,
  slots: Partial<ObjectOf<any, K>>
): T | undefined {
  const keys = Object.keys(mediaRules);
  const len = keys.length;

  validateSlots(keys, slots);

  let index = 0;
  for (; index < len; index++) {
    if (matches[keys[index]]) {
      break;
    }
  }

  for (; index >= 0; index--) {
    const value = slots[keys[index]];
    if (value !== undefined) {
      return (keys[index] as unknown) as T;
    }
  }
  return undefined;
}

export function pickMediaMatch<T, K>(
  mediaRules: MediaRulesOf<T>,
  matches: Partial<BoolOf<any>>,
  slots: Partial<ObjectOf<any, K>>,
  defaultValue?: K
): K | undefined {
  const keys = Object.keys(mediaRules);
  const len = keys.length;

  validateSlots(keys, slots);

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

  // could be only possible if no slots is given, so K is undefined
  return defaultValue;
}

export interface Names {
  [key: string]: any;
}

export function pickMatchValues(points: Names, props: Names) {
  const keys = Object.keys(points);
  validateSlots(keys, props);

  return keys.reduce((acc: any, key: string) => {
    if (props[key] !== undefined) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
}

export function inBetween(breakPoints: Names, points: any, value: any, invert: boolean, include: boolean) {
  const keys = Object.keys(breakPoints);
  let pass = false;
  validateSlots(keys, points);
  return Object.keys(breakPoints).reduce((acc: any, key: string) => {
    if (invert && points[key]) {
      pass = true;
    }
    acc[key] = (include ? pass : !pass) ? null : value;
    if (!invert && points[key]) {
      pass = true;
    }
    return acc;
  }, {});
}

export function nothingSet(matches: { [key: string]: any }): { [key: string]: boolean } {
  return Object.keys(matches).reduce((acc: any, key) => {
    acc[key] = false;

    return acc;
  }, {});
}

export function notNulls(matches: { [key: string]: boolean | undefined }): { [key: string]: boolean } {
  return Object.keys(matches).reduce((acc: any, key) => {
    if (matches[key] !== undefined) {
      acc[key] = matches[key];
    }

    return acc;
  }, {});
}
