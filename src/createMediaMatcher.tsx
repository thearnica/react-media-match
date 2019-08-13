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
  pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K,
  useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null,

  Provider: React.SFC<{ state?: BoolOf<T> }>;
  Mock: React.SFC<Partial<RenderOf<T>>>;
  Override: React.SFC<Partial<RenderOf<T>>>;

  Matches: React.SFC<{ children: RenderMatch<T, any> }>,
  Inline: React.SFC<Partial<RenderOf<T>>>,

  Below: React.SFC<Partial<BoolOf<T>> & Including>,
  Above: React.SFC<Partial<BoolOf<T>> & Including>,

  Matcher: React.SFC<Partial<RenderOf<T>>>,
  ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }>,

  Gearbox: React.Consumer<Partial<BoolOf<T>>>,
  Consumer: React.Consumer<Partial<BoolOf<T>>>,
}

export function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>): MediaMatcherType<T> {
  const mediaDefaults = executeMediaQuery(breakPoints);
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
    return pickMediaMatch<T, K>(breakPoints, matches, slots)
  }

  function useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null {
    const matches = getMediaMatches(React.useContext(MediaContext) as BoolOf<T>);
    return pickMatch(matches, slots);
  }

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: Partial<BoolOf<T>>, slots: M): React.ReactNode {
    return pickMediaMatch<T, React.ReactNode>(breakPoints, matches, slots)
  }

  const ProvideMediaMatchers: React.SFC<{ state?: BoolOf<T> }> = ({children, state = null}) => (
    <MediaContext.Consumer>
      {(parentMatch: any) =>
        <Media queries={breakPoints}>
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
      ...castPointsTo(breakPoints, PropTypes.bool)
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

  const MediaMatcher: React.SFC<Partial<RenderOf<T>> & NoChildren> = (props) => (
    consume(matched => pickMatchEx(matched as BoolOf<T>, props))
  );

  MediaMatcher.propTypes = process.env.NODE_ENV !== "production" ? {
    ...castPointsTo(breakPoints, PropTypes.node)
  } : {};

  const InlineMediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
    consume(matched => pickMatchEx(matched, props))
  );

  const Mock: React.SFC<Partial<RenderOf<T>>> = (props: any) => (
    <MediaContext.Provider
      value={pickMatchValues(breakPoints, {...nothingSet(breakPoints), ...props})}
    >
      {props.children}
    </MediaContext.Provider>
  );

  const Override: React.SFC<Partial<RenderOf<T>>> = (props: any) => (
    <MediaContext.Consumer>
      {(parentMatch: any) => {
        const value: BoolOf<T> = {
          ...notNulls(parentMatch),
          ...pickMatchValues(breakPoints, props),
        };
        return <MediaContext.Provider
          value={value}
          children={props.children}
        />
      }}
    </MediaContext.Consumer>
  );

  const Below: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(breakPoints, props, props.children, props.including ? false : true, true)}/>
  );

  const Above: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(breakPoints, props, props.children, props.including ? true : false, false)}/>
  );

  const ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }> = ({predicted, hydrated, children}) => (
    <MediaContext.Provider value={{[predicted]: true} as BoolOf<T>}>
      <ProvideMediaMatchers>
        <MediaContext.Consumer>
          {matched => (
            <MediaServerSide
              fact={getMaxMatch(breakPoints, matched)}
              predicted={predicted}
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
