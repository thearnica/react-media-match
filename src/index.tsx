import * as React from "react";
import {createMediaMatcher, MediaMatcherType} from "./createMediaMatcher";
import mediaDefaults from './mediaDefaults'
// @ts-ignore
import {BoolOf, IMediaQuery, Including} from './types';

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
const Matches = defaultMedia.Matches;

const MediaMock = defaultMedia.Mock;

/**
 * Renders only below specific break point
 */
const Below = defaultMedia.Below;

/**
 * Renders only above specific break point
 */
const Above = defaultMedia.Above;

/**
 * ServerSide rendering helper
 */
const MediaServerRender = defaultMedia.ServerRender;

const MediaConsumer = defaultMedia.Consumer;

/**
 * pickMatchHookAPI
 */
const useMedia = defaultMedia.useMedia;


export {
    createMediaMatcher,

    pickMatch,

    ProvideMediaMatchers,

    MediaMatches,
    InlineMediaMatcher,
    Above,
    Below,

    MediaMatcher,

    MediaServerRender,

    Matches,
    MediaMock,

    MediaConsumer,

    useMedia,
}
