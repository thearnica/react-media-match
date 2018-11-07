import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Media, BoolHash} from './Media'

// @ts-ignore
import {BoolOf, MediaRulesOf, ObjectOf, RenderMatch, RenderOf, IMediaQuery} from "./types";
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

interface Including {
  including?: boolean;
}

export type NoChildren = { children?: never };

// export type MediaMatcherType<T, M> = {
//   pickMatch(matches: BoolOf<T>, slots: M): React.ReactNode | null,
//
//   Provider: React.SFC<{ state?: MediaRulesOf<T>, override?: false }>;
//   Mock: React.SFC<Partial<RenderOf<T>>>;
//
//   Matches: React.SFC<{ children: RenderMatch<T, any> }>,
//   Inline: React.SFC<Partial<RenderOf<T>>>,
//
//   Matcher: React.SFC<Partial<RenderOf<T>>>,
//   ServerRender: React.SFC<{ predicted: keyof T, hydrated?: boolean, children: React.ReactNode }>,
//
//   Gearbox: React.Consumer<BoolHash>,
// }

export function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>) {
  const MediaContext = React.createContext<BoolHash>({});

  function pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K | null {
    return pickMediaMatch<T, K>(breakPoints, matches, slots)
  }

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: BoolOf<T>, slots: M): React.ReactNode | null {
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

  ProvideMediaMatchers.propTypes = {
    state: PropTypes.shape({
      ...castPointsTo(breakPoints, PropTypes.bool)
    }),
    override: PropTypes.bool
  };

  const MediaMatches: React.SFC<{ children: RenderMatch<T, any> }> = ({children}) => (
    <MediaContext.Consumer>
      {matched => children(matched as BoolOf<T>, (matches) => pickMatch(matched as BoolOf<T>, matches))}
    </MediaContext.Consumer>
  );

  MediaMatches.propTypes = {
    children: PropTypes.func.isRequired
  };

  const MediaMatcher: React.SFC<Partial<RenderOf<T>> & NoChildren> = (props) => (
    <MediaContext.Consumer>{matched => pickMatchEx(matched as BoolOf<T>, props)}</MediaContext.Consumer>
  );

  MediaMatcher.propTypes = {
    ...castPointsTo(breakPoints, PropTypes.node)
  };

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

    Provider: ProvideMediaMatchers,
    Mock,

    Matches: MediaMatches,
    Inline: InlineMediaMatcher,
    Above,
    Below,

    Matcher: MediaMatcher,
    ServerRender,

    Gearbox: MediaContext.Consumer
  }
}
