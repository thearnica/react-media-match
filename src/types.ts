import * as React from "react";

export type RenderMatch<T> = (matches: BoolOf<T>) => React.ReactNode;

export type ObjectOf<T, K> = { [P in keyof T]: K };


export interface MediaQuery {
    minWidth: number;
    maxWidth: number;
    screen: boolean;
    handheld: boolean;
    aspectRatio: number,
    resolution: string;
    orientation: 'landscape' | 'portrait'
}

export type MediaRule = string | MediaQuery;

export type MediaRulesOf<T> = ObjectOf<T, MediaRule>;

export type BoolOf<T> = ObjectOf<T, boolean>;

export type RenderOf<T> = ObjectOf<T, React.ReactNode>;


