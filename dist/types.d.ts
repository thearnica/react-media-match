/// <reference types="react" />
import * as React from "react";
export declare type RenderMatch<T> = (matches: BoolOf<T>) => React.ReactNode;
export declare type ObjectOf<T, K> = {
    [P in keyof T]: K;
};
export interface MediaQuery {
    minWidth: number;
    maxWidth: number;
    screen: boolean;
    handheld: boolean;
    aspectRatio: number;
    resolution: string;
    orientation: 'landscape' | 'portrait';
}
export declare type MediaRule = string | MediaQuery;
export declare type MediaRulesOf<T> = ObjectOf<T, MediaRule>;
export declare type BoolOf<T> = ObjectOf<T, boolean>;
export declare type RenderOf<T> = ObjectOf<T, React.ReactNode>;
