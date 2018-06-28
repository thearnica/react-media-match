import {createMediaMatcher} from "./createMediaMatcher";
import mediaDefaults from './mediaDefaults'
// @ts-ignore
import {SFC, ComponentType, ReactElement, StatelessComponent, ReactPortal} from 'react';
// @ts-ignore
import {IMediaQuery} from './types';

const defaultMedia = createMediaMatcher(mediaDefaults);

/**
 * Picks value from Slots for matching Match)
 * @type {<K>(matches: BoolOf<T>, slots: ObjectOf<T, K>) => K}
 */
const pickMatch = defaultMedia.pickMatch;

/**
 * Provides Context for underlayed consumers
 * @type {SFC}
 */
const ProvideMediaMatchers = defaultMedia.Provider;
/**
 * Consumes provided information from context and returns via renderProps
 * @type {SFC<{children: RenderMatch<any>}>}
 */
const MediaMatches = defaultMedia.Matches;
/**
 * Calculates media match and renders a rule
 * @type {SFC<RenderOf<any>>}
 */
const InlineMediaMatcher = defaultMedia.Inline;
/**
 * Consumes provided information and renders matched rule
 * @type {SFC<RenderOf<any>>}
 */
const MediaMatcher = defaultMedia.Matcher;

/**
 * Calculates media match and returns via renderProps
 * @type {RPC<any, any>}
 */
const Matches = defaultMedia.Gearbox;

const MediaMock = defaultMedia.Mock;

/**
 * ServerSide rendering helper
 */
const MediaServerRender = defaultMedia.ServerRender;


export {
    createMediaMatcher,

    pickMatch,

    ProvideMediaMatchers,

    MediaMatches,
    InlineMediaMatcher,

    MediaMatcher,

    MediaServerRender,

    Matches,
    MediaMock
}