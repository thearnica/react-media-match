/// <reference types="react" />
import { createMediaMatcher } from "./createMediaMatcher";
import { ComponentType, ReactElement, StatelessComponent, ReactPortal } from 'react';
declare const pickMatch: <K>(matches: {
    'mobile': boolean;
    'tablet': boolean;
    'desktop': boolean;
}, slots: Partial<{
    'mobile': K;
    'tablet': K;
    'desktop': K;
}>) => K;
declare const ProvideMediaMatchers: StatelessComponent<{}>;
declare const MediaMatches: StatelessComponent<{
    children: (matches: {
        'mobile': boolean;
        'tablet': boolean;
        'desktop': boolean;
    }) => string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
}>;
declare const InlineMediaMatcher: StatelessComponent<Partial<{
    'mobile': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
    'tablet': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
    'desktop': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
}>>;
declare const MediaMatcher: StatelessComponent<Partial<{
    'mobile': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
    'tablet': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
    'desktop': string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
}>>;
declare const Matches: ComponentType<{
    children: (matches: {
        'mobile': boolean;
        'tablet': boolean;
        'desktop': boolean;
    }) => string | number | boolean | {} | ReactElement<any> | (string | number | boolean | any[] | ReactElement<any>)[] | ReactPortal;
}>;
export { createMediaMatcher, pickMatch, ProvideMediaMatchers, MediaMatches, InlineMediaMatcher, MediaMatcher, Matches };
