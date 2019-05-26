import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Media, BoolHash, executeMediaQuery} from './Media'

// @ts-ignore
import {BoolOf, MediaRulesOf, ObjectOf, RenderMatch, RenderOf, IMediaQuery, Including} from "./types";
import {getMaxMatch, inBetween, notNulls, pickMatchValues, pickMediaMatch} from "./utils";
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

  Provider: React.SFC<{ state?: MediaRulesOf<T>, override?: false }>;
  Mock: React.SFC<Partial<RenderOf<T>>>;

  Matches: React.SFC<{ children: RenderMatch<T, any> }>,
  Inline: React.SFC<Partial<RenderOf<T>>>,

  Below: React.SFC<Partial<BoolOf<T>> & Including>,
  Above: React.SFC<Partial<BoolOf<T>> & Including>,

  Matcher: React.SFC<Partial<RenderOf<T>>>,
  ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }>,

  Gearbox: React.Consumer<BoolHash>,
  Consumer: React.Consumer<BoolHash>,
}

export function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>): MediaMatcherType<T> {
  const MediaContext = React.createContext<BoolHash>(executeMediaQuery(breakPoints));

  function pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K {
    return pickMediaMatch<T, K>(breakPoints, matches, slots)
  }

  function useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null {
    const matches = React.useContext(MediaContext);
    return pickMatch(matches as any, slots);
  }

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: BoolOf<T>, slots: M): React.ReactNode {
    return pickMediaMatch<T, React.ReactNode>(breakPoints, matches, slots)
  }

  const ProvideMediaMatchers: React.SFC<{ state?: MediaRulesOf<T>, override?: false }> = ({children, state = null, override = false}) => (
    <MediaContext.Consumer>
      {parentMatch =>
        <Media queries={breakPoints}>
          {(matches) => {
            const value: BoolHash = (state as any) || {...(override ? {} : parentMatch), ...notNulls(matches)};
            return <MediaContext.Provider
              value={value}
              children={children}
            />
          }
          }
        </Media>
      }
    </MediaContext.Consumer>
  );

  ProvideMediaMatchers.propTypes = process.env.NODE_ENV !== "production" ? {
    state: PropTypes.shape({
      ...castPointsTo(breakPoints, PropTypes.bool)
    }) as any,
    override: PropTypes.bool
  } : {} as any;

  const MediaMatches: React.SFC<{ children: RenderMatch<T, any> }> = ({children}) => (
    <MediaContext.Consumer>
      {matched => children(matched as BoolOf<T>, (matches) => pickMatch(matched as BoolOf<T>, matches))}
    </MediaContext.Consumer>
  );

  MediaMatches.propTypes = process.env.NODE_ENV !== "production" ? {
    children: PropTypes.func.isRequired
  } : {};

  const MediaMatcher: React.SFC<Partial<RenderOf<T>> & NoChildren> = (props) => (
    <MediaContext.Consumer>{matched => pickMatchEx(matched as BoolOf<T>, props)}</MediaContext.Consumer>
  );

  MediaMatcher.propTypes = process.env.NODE_ENV !== "production" ? {
    ...castPointsTo(breakPoints, PropTypes.node)
  } : {};

  const InlineMediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
    <MediaContext.Consumer>{(matched: any) => pickMatchEx(matched, props)}</MediaContext.Consumer>
  );

  const Mock: React.SFC<Partial<RenderOf<T>>> = (props) => (
    <MediaContext.Provider value={pickMatchValues(breakPoints, props)}>{props.children}</MediaContext.Provider>
  );

  const Below: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(breakPoints, props, props.children, props.including ? false : true, true)}/>
  );

  const Above: React.SFC<Partial<BoolOf<T>> & Including> = (props) => (
    <MediaMatcher {...inBetween(breakPoints, props, props.children, props.including ? true : false, false)}/>
  );

  const ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }> = ({predicted, hydrated, children}) => (
    <MediaContext.Provider value={{[predicted]: true}}>
      <ProvideMediaMatchers>
        <MediaContext.Consumer>
          {matched => (
            <MediaServerSide
              fact={getMaxMatch(breakPoints, matched)}
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
