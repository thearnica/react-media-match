import {MediaRulesOf, ObjectOf, BoolOf} from "./types";

export function forEachName<T, K, R = Object & {[key in keyof T]: K}>
(object: MediaRulesOf<T>, map: (key: string) => K): R {
    return Object
        .keys(object)
        .map(key => ({key, value: map(key)}))
        .reduce((acc: any, line): R => ({
            ...acc,
            [line.key]: line.value
        }), {} as R)
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
        if (value || value === null) {
            return value;
        }
    }

    return null;
}