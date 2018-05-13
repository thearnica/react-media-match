import { MediaRulesOf, ObjectOf, BoolOf } from "./types";
export declare function forEachName<T, K, R = {
    [key in keyof T]: K;
}>(object: MediaRulesOf<T>, map: (key: string) => K): R;
export declare function pickMediaMatch<T, K>(mediaRules: MediaRulesOf<T>, matches: BoolOf<any>, slots: Partial<ObjectOf<any, K>>): K | null;
