import {ReactNode} from "react";

export type RenderMatch<T> = (matches: BoolOf<T>) => ReactNode;

export type ObjectOf<T, K> = { [P in keyof T]: K };

export interface IMediaQuery {
    minWidth: number;
    maxWidth: number;
    screen: boolean;
    handheld: boolean;
    aspectRatio: number,
    resolution: string;
    orientation: 'landscape' | 'portrait'
}

export type MediaRule = string | IMediaQuery;

export type MediaRulesOf<T> = ObjectOf<T, MediaRule>;

export type BoolOf<T> = ObjectOf<T, boolean>;

export type RenderOf<T> = ObjectOf<T, ReactNode>;


