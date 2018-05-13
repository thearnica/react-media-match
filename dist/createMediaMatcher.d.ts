/// <reference types="react" />
import * as React from 'react';
import { MediaRulesOf, ObjectOf, RenderMatch } from "./types";
export declare function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>): {
    pickMatch: <K>(matches: ObjectOf<T, boolean>, slots: Partial<ObjectOf<T, K>>) => K;
    ProvideMediaMatchers: React.StatelessComponent<{}>;
    MediaMatches: React.StatelessComponent<{
        children: RenderMatch<T>;
    }>;
    InlineMediaMatcher: React.StatelessComponent<Partial<ObjectOf<T, React.ReactNode>>>;
    MediaMatcher: React.StatelessComponent<Partial<ObjectOf<T, React.ReactNode>>>;
    Matches: React.ComponentType<{
        children: (matches: ObjectOf<T, boolean>) => React.ReactNode;
    }>;
};
