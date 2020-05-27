import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Media, executeMediaQuery} from './Media'

// @ts-ignore
import {BoolOf, MediaRulesOf, ObjectOf, RenderMatch, RenderOf, IMediaQuery, Including} from "./types";
import {getMaxMatch, inBetween, nothingSet, notNulls, pickMatchValues, pickMediaMatch} from "./utils";
import {MediaServerSide} from "./SSR";

const castPointsTo = (points: { [key: string]: any }, targetType: any) => (
  Object
    .keys(points)
    .reduce((acc: { [key: string]: typeof targetType }, key: string) => {
      acc[key] = targetType;
      return acc
    }, {})
);

export type NoChildren = { children?: never };

export type MediaMatcherType<T> = {

  // pickers

  /**
   * Picks value from Slots for matching Match)
   * @type {<K>(matches: BoolOf<T>, slots: ObjectOf<T, K>) => K}
   * @see {useMedia}
   */
  pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K,
  /**
   * React hook - returns the current state
   * @see {pickMatch}
   */
  useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null,


  /**
   * RenderProp component returning
   * - matches - a current state, an object passable to {@link pickMatch}
   * - pickMatch - a {@link pickMatch} version with prefilled matches
   *
   * @example
   * <Matches>
   *   {({matches, pickMatch}) =>
   *     pickMatch({
   *       match1: ...,
   *       match2: ...
   *     })
   *   }
   * </Matches>
   */
  Matches: React.SFC<{ children: RenderMatch<T, any> }>,
  /**
   * an isolated version of {@link Matches}.
   * DOES NOT USES GLOBAL STATE
   * Not affected by {@link Mock}, {@link Override} or {@link ServerRender}
   *
   * @deprecated
   */
  Inline: React.SFC<Partial<RenderOf<T>>>,

  // providers
  /**
   * Makes Media Matcher reactive by
   * providing context for underlying consumers
   *
   * Without it everything would be __static__
   *
   * @example
   * just wrap your application with it
   */
  Provider: React.SFC<{ state?: BoolOf<T> }>;
  /**
   * ! to be used for testing and server side rendering !
   *
   * Replaces a whole state with a provided values
   * expects arguments to be keys: as given, values: boolean
   *
   * @see {Provider}
   */
  Mock: React.SFC<Partial<RenderOf<T>>>;
  /**
   * ! to be used for testing and server side rendering !
   *
   * The same as {@link Mock}, but replaces only a part of a state
   *
   * @see {Mock}
   */
  Override: React.SFC<Partial<RenderOf<T>>>;

  /**
   * A Server side helper - accepts a "predicted" target (the one used during SSR)
   * and if it does not match - safely remounts the app
   */
  ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }>,

  /**
   * Renders given children only on states Below(or +including) given
   * @example
   * <breakpoints.Below tablet>Probably mobile</breakpoints.Below>
   */
  Below: React.SFC<Partial<BoolOf<T>> & Including>,
  /**
   * Renders given children only on states Above(or +including) given
   * @example
   * <breakpoints.Above tablet including>Probably not mobile</breakpoints.Above>
   */
  Above: React.SFC<Partial<BoolOf<T>> & Including>,

  /**
   * renders only one matching path
   * @example
   * <Matcher
   *   mobile="render mobile"
   *   tablet="render on anything above"
   * />
   */
  Matcher: React.SFC<Partial<RenderOf<T>>>,

  /**
   * @deprecated
   */
  Gearbox: React.Consumer<Partial<BoolOf<T>>>,
  /**
   * @deprecated
   */
  Consumer: React.Consumer<Partial<BoolOf<T>>>,
}

/**
 * Creates a group media matcher
 * @param queries - an object with keys - state names, and values - media queries
 * @example
 * createMediaMatcher({
 *   small: '(max-width: 600px)',
 *   big: '(min-width: 600px)',
 * });
 * @see https://github.com/thearnica/react-media-match#api
 */
export function createMediaMatcher<T>(queries: MediaRulesOf<T>): MediaMatcherType<T> {
  const mediaDefaults = executeMediaQuery(queries);
  const initialValue = {} as any;
  const MediaContext = React.createContext<Partial<BoolOf<T>>>(initialValue);

  const getMediaMatches = (matches: BoolOf<T>) => (
    matches === initialValue ? mediaDefaults : matches
  );

  const consume = (cb: (match: BoolOf<T>) => React.ReactNode) => (
    <MediaContext.Consumer>
      {matched => cb(getMediaMatches(matched as BoolOf<T>))}
    </MediaContext.Consumer>
  );

  function pickMatch<K>(matches: Partial<BoolOf<T>>, slots: Partial<ObjectOf<T, K>>): K {
    return pickMediaMatch<T, K>(queries, matches, slots)
  }

  function useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null {
    const matches = getMediaMatches(React.useContext(MediaContext) as BoolOf<T>);
    return pickMatch(matches, slots);
  }

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: Partial<BoolOf<T>>, slots: M): React.ReactNode {
    return pickMediaMatch<T, React.ReactNode>(queries, matches, slots)
  }

  const ProvideMediaMatchers: React.SFC<{ state?: BoolOf<T> }> = ({children, state = null}) => (
    <MediaContext.Consumer>
      {(parentMatch: any) =>
        <Media queries={queries}>
          {(matches) => {
            const value: BoolOf<T> = state || {
              ...notNulls(matches),
              ...(parentMatch || {}),
            };
            return <MediaContext.Provider
              value={value}
              children={children}
            />
          }}
        </Media>
      }
    </MediaContext.Consumer>
  );

  ProvideMediaMatchers.propTypes = process.env.NODE_ENV !== "production" ? {
    state: PropTypes.shape({
      ...castPointsTo(queries, PropTypes.bool)
    }) as any,
  } : {} as any;

  const MediaMatches: React.SFC<{ children: RenderMatch<T, any> }> = ({children}) => (
    consume(
      matched => children(matched, (matches) => pickMatch(matched as BoolOf<T>, matches))
    )
  );

  MediaMatches.propTypes = process.env.NODE_ENV !== "production" ? {
    children: PropTypes.func.isRequired
  } : {};

  const InlineMediaMatcher: React.SFC<Partial<RenderOf<T>> & NoChildren > = (props) => (
    consume(matched => pickMatchEx(matched, props))
  );

  const MediaMatcher: React.SFC<Partial<RenderOf<T>> & NoChildren> = (props) => (
    consume(matched => pickMatchEx(matched, props))
  );

  MediaMatcher.propTypes = process.env.NODE_ENV !== "production" ? {
    ...castPointsTo(queries, PropTypes.node)
  } : {};

  const Mock: React.SFC<Partial<RenderOf<T>>> = (props: any) => (
    <MediaContext.Provider
      value={pickMatchValues(queries, {...nothingSet(queries), ...props})}
    >
      {props.children}
    </MediaContext.Provider>
  );

  const Override: React.SFC<Partial<RenderOf<T>>> = (props: any) => (
    <MediaContext.Consumer>
      {(parentMatch: any) => {
        const value: BoolOf<T> = {
          ...notNulls(parentMatch),
          ...pickMatchValues(queries, props),
        };
        return <MediaContext.Provider
          value={value}
          children={props.children}
        />
      }}
    </MediaContext.Consumer>
  );

  const Below: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(queries, props, props.children, props.including ? false : true, true)}/>
  );

  const Above: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(queries, props, props.children, props.including ? true : false, false)}/>
  );

  const ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }> = ({predicted, hydrated, children}) => (
    <MediaContext.Provider value={{[predicted]: true} as BoolOf<T>}>
      <ProvideMediaMatchers>
        <MediaContext.Consumer>
          {matched => (
            <MediaServerSide
              fact={getMaxMatch(queries, matched)}
              predicted={predicted as any}
              hydrated={!!hydrated}
              children={children}
            />
          )}
        </MediaContext.Consumer>
      </ProvideMediaMatchers>
    </MediaContext.Provider>
  );

  return {
    pickMatch,
    useMedia,

    Provider: ProvideMediaMatchers,
    Mock,
    Override,
    //
    Matches: MediaMatches,
    Inline: InlineMediaMatcher,
    Above,
    Below,
    //
    Matcher: MediaMatcher,
    ServerRender,
    //
    Gearbox: MediaContext.Consumer,
    Consumer: MediaContext.Consumer
  }
}
