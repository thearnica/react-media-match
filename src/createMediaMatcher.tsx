import * as React from 'react';
import * as RawMedia from 'react-media';
import {adopt} from "react-adopt";
import {MediaContext} from './context';

import {BoolOf, MediaRulesOf, ObjectOf, RenderMatch, RenderOf} from "./types";
import {forEachName, pickMediaMatch} from "./utils";

type AdoptMatches<T> = (matches: BoolOf<T>) => React.ReactNode | null;

type Media = React.ReactElement<{children: (match:boolean) => React.ReactNode}>

// Hack, dirty hack
const Media = RawMedia.default || RawMedia;

function createMatcher<T, G extends keyof T>(mediaRules: MediaRulesOf<T>): React.ComponentType<{ children: AdoptMatches<T> }> {
    return adopt(
        forEachName<T, Media>(
            mediaRules,
            (rule: string) => <Media query={mediaRules[rule as G]}/>
        )
    ) as any;
};

export function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>) {
    const Matches = createMatcher(breakPoints);

    function pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K | null {
        return pickMediaMatch<T, K>(breakPoints, matches, slots)
    };

    function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: BoolOf<T>, slots: M): React.ReactNode | null {
        return pickMediaMatch<T, React.ReactNode>(breakPoints, matches, slots)
    };

    const ProvideMediaMatchers: React.SFC = ({children}) => (
        <Matches>
            {matches => <MediaContext.Provider value={matches}>{children}</MediaContext.Provider>}
        </Matches>
    );

    const MediaMatches: React.SFC<{ children: RenderMatch<T> }> = ({children}) => (
        <MediaContext.Consumer>{matched => children(matched as BoolOf<T>)}</MediaContext.Consumer>
    );

    const MediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
        <MediaContext.Consumer>{matched => pickMatchEx(matched as BoolOf<T>, props)}</MediaContext.Consumer>
    );

    const InlineMediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
        <Matches>{matched => pickMatchEx(matched, props)}</Matches>
    );

    return {
        pickMatch,

        ProvideMediaMatchers,

        MediaMatches,
        InlineMediaMatcher,

        MediaMatcher,

        Matches
    }
}