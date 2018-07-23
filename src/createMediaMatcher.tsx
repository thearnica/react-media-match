import * as React from 'react';
import {gearbox} from "react-gearbox";
import * as PropTypes from 'prop-types';
import {Media} from './Media'

// @ts-ignore
import {BoolOf, MediaRulesOf, ObjectOf, RenderMatch, RenderOf, IMediaQuery} from "./types";
import {forEachName, getMaxMatch, notNulls, pickMatchValues, pickMediaMatch} from "./utils";
import {MediaServerSide} from "./SSR";

type AdoptMatches<T> = (matches: BoolOf<T>) => React.ReactNode | null;
type MediaElement = React.ReactElement<any>;

function createMatcher<T, G extends keyof T>(mediaRules: MediaRulesOf<T>): React.ComponentType<{
  render: boolean,
  local: boolean,
  children: AdoptMatches<T>
}> {
  return gearbox(
    forEachName<T, MediaElement>(
      mediaRules,
      (rule: string) => <Media query={mediaRules[rule as G]} children={null as any}/>
    )
  ) as any;
};

const castPointsTo = (points: { [key: string]: any }, targetType: any) => (
  Object
    .keys(points)
    .reduce((acc: { [key: string]: typeof targetType }, key: string) => {
      acc[key] = targetType;
      return acc
    }, {})
);

export function createMediaMatcher<T>(breakPoints: MediaRulesOf<T>) {
  const MediaContext = React.createContext({});

  const Matches = createMatcher(breakPoints);

  function pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K | null {
    return pickMediaMatch<T, K>(breakPoints, matches, slots)
  };

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(matches: BoolOf<T>, slots: M): React.ReactNode | null {
    return pickMediaMatch<T, React.ReactNode>(breakPoints, matches, slots)
  };

  const ProvideMediaMatchers: React.SFC<{ state?: MediaRulesOf<T>, override?: false }> = ({children, state = null, override = false}) => (
    <MediaContext.Consumer>
      {parentMatch =>
        <Matches render local>
          {
            (matches: any) => {
              const value = state || {...(override ? {} : parentMatch), ...notNulls(matches)};
              return <MediaContext.Provider
                value={value}
                children={children}
              />
            }
          }
        </Matches>
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

  const MediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
    <MediaContext.Consumer>{matched => pickMatchEx(matched as BoolOf<T>, props)}</MediaContext.Consumer>
  );

  MediaMatcher.propTypes = {
    ...castPointsTo(breakPoints, PropTypes.node)
  };

  const InlineMediaMatcher: React.SFC<Partial<RenderOf<T>>> = (props) => (
    <Matches render local>{(matched: any) => pickMatchEx(matched, props)}</Matches>
  );

  const Mock: React.SFC<Partial<RenderOf<T>>> = (props) => (
    <MediaContext.Provider value={pickMatchValues(breakPoints, props)}>{props.children}</MediaContext.Provider>
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

    Matcher: MediaMatcher,
    ServerRender,

    Gearbox: Matches
  }
}