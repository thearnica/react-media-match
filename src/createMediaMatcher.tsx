import * as PropTypes from 'prop-types';
import * as React from 'react';

import { FC, ReactNode, useDebugValue, useEffect, useMemo, useState } from 'react';

import { executeMediaQuery, Media } from './Media';

import {
  BoolOf,
  Including,
  LeafComponent,
  MediaMatcherType,
  MediaRulesOf,
  ObjectOf,
  RenderMatch,
  RenderOf,
  ObjectShape,
} from './types';
import {
  getMaxMatch,
  inBetween,
  nothingSet,
  notNulls,
  pickMatchValues,
  pickMediaMatch,
  pickMediaMatchSlot,
} from './utils';

const castPointsTo = (points: { [key: string]: any }, targetType: any) =>
  Object.keys(points).reduce((acc: { [key: string]: typeof targetType }, key: string) => {
    acc[key] = targetType;

    return acc;
  }, {});

const skipProp: any = {};
// @ts-ignore
const use = (...args: any[]) => null;

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
export function createMediaMatcher<T extends ObjectShape>(queries: MediaRulesOf<T>): MediaMatcherType<T, keyof T>;
export function createMediaMatcher<T extends ObjectShape, FirstKey extends keyof T = keyof T>(
  queries: MediaRulesOf<T>,
  firstKey: FirstKey
): MediaMatcherType<T, FirstKey>;

export function createMediaMatcher<T extends ObjectShape, FirstKey extends keyof T = keyof T>(
  queries: MediaRulesOf<T>,
  firstKey?: FirstKey
): MediaMatcherType<T, FirstKey> {
  use(firstKey);

  const mediaDefaults = executeMediaQuery(queries);
  const initialValue = {} as any;
  const MediaContext = React.createContext<Partial<BoolOf<T>>>(initialValue);

  const getMediaMatches = (matches: BoolOf<T>) => (matches === initialValue ? mediaDefaults : matches);

  const consume = (cb: (match: BoolOf<T>) => React.ReactNode) => (
    <MediaContext.Consumer>{(matched) => cb(getMediaMatches(matched as BoolOf<T>))}</MediaContext.Consumer>
  );

  function pickMatch<K>(matches: Partial<BoolOf<T>>, slots: Partial<ObjectOf<T, K>>, defaultValue?: K): K | undefined {
    return pickMediaMatch<T, K>(queries, matches, slots, defaultValue);
  }

  function useMedia<K>(slots: Partial<ObjectOf<T, K>>, defaultValue?: K): K | undefined {
    const matches = getMediaMatches(React.useContext(MediaContext) as BoolOf<T>);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useDebugValue(pickMediaMatchSlot(queries, matches, slots) || 'default');
    }

    return pickMatch(matches, slots, defaultValue);
  }

  function pickMatchEx<M extends Partial<ObjectOf<T, React.ReactNode>>>(
    matches: Partial<BoolOf<T>>,
    slots: M
  ): React.ReactNode {
    return pickMediaMatch<T, React.ReactNode>(queries, matches, slots);
  }

  const ProvideMediaMatchers: React.FC<{ state?: BoolOf<T>; children: ReactNode }> = ({ children, state = null }) => (
    <MediaContext.Consumer>
      {(parentMatch: any) => (
        <Media queries={queries}>
          {(matches) => {
            const value: BoolOf<T> = state || {
              ...(parentMatch || {}),
              ...notNulls(matches),
            };

            return <MediaContext.Provider value={value} children={children} />;
          }}
        </Media>
      )}
    </MediaContext.Consumer>
  );

  ProvideMediaMatchers.propTypes =
    // @ts-ignore
    process.env.NODE_ENV !== 'production'
      ? {
          state: PropTypes.shape({
            ...castPointsTo(queries, PropTypes.bool),
          }) as any,
        }
      : skipProp;

  const MediaMatches: LeafComponent<{ children: RenderMatch<T, any> }> = ({ children }) =>
    consume((matched) => children(matched, (matches) => pickMatch(matched as BoolOf<T>, matches)));

  MediaMatches.propTypes =
    // @ts-ignore
    process.env.NODE_ENV !== 'production'
      ? {
          children: PropTypes.func.isRequired,
        }
      : skipProp;

  const InlineMediaMatcher: LeafComponent<Partial<RenderOf<T>>> = (props) =>
    consume((matched) => pickMatchEx(matched, props));

  const MediaMatcher: LeafComponent<Partial<RenderOf<T>>> = (props) =>
    consume((matched) => pickMatchEx(matched, props));

  MediaMatcher.propTypes =
    // @ts-ignore
    process.env.NODE_ENV !== 'production'
      ? {
          ...castPointsTo(queries, PropTypes.node),
        }
      : skipProp;

  const Mock: React.FC<Partial<RenderOf<T>> & { children: ReactNode }> = ({ children, ...props }) => (
    <MediaContext.Provider value={pickMatchValues(queries, { ...nothingSet(queries), ...props })}>
      {children}
    </MediaContext.Provider>
  );

  const Override: React.FC<Partial<RenderOf<T>> & { children: ReactNode }> = ({ children, ...props }) => (
    <MediaContext.Consumer>
      {(parentMatch: any) => {
        const value: BoolOf<T> = {
          ...notNulls(parentMatch),
          ...pickMatchValues(queries, props),
        };

        return <MediaContext.Provider value={value} children={children} />;
      }}
    </MediaContext.Consumer>
  );

  const Below: React.FC<Partial<BoolOf<T>> & Including & { children: ReactNode }> = ({
    children,
    including,
    ...props
  }) => <MediaMatcher {...inBetween(queries, props, children, !including, true)} />;

  const Above: React.FC<Partial<BoolOf<T>> & Including & { children: ReactNode }> = ({
    children,
    including,
    ...props
  }) => <MediaMatcher {...inBetween(queries, props, children, !!including, false)} />;

  const MediaServerSide: FC<{
    children: ReactNode;
    predicted: keyof T;
    hydrated?: boolean;
    onWrongPrediction?(predicted: keyof T, factual: keyof T): void;
  }> = ({ predicted, hydrated, onWrongPrediction, children }) => {
    const [isHydrated, setHydrated] = useState(hydrated === undefined ? false : hydrated);
    const media = React.useContext(MediaContext) as BoolOf<T>;

    useEffect(() => {
      setHydrated(hydrated === undefined ? true : hydrated);
    }, [hydrated]);

    useEffect(() => {
      if (isHydrated && !media[predicted]) {
        if (onWrongPrediction) {
          onWrongPrediction(predicted, getMaxMatch(queries, media));
        }
      }
    }, [isHydrated]);

    const overrides = useMemo(() => {
      if (isHydrated) {
        return media;
      } else {
        return {
          ...nothingSet(queries),
          [predicted]: true,
        } as BoolOf<T>;
      }
    }, [media, isHydrated]);

    return <MediaContext.Provider value={overrides} children={children} />;
  };

  const ServerRender: React.FC<{
    predicted: keyof T;
    hydrated?: boolean;
    children: React.ReactNode;
    onWrongPrediction?(predicted: keyof T, factual: keyof T): void;
  }> = ({ predicted, hydrated, onWrongPrediction, children }) => (
    <ProvideMediaMatchers>
      <MediaServerSide
        predicted={predicted as any}
        hydrated={hydrated}
        onWrongPrediction={onWrongPrediction}
        children={children}
      />
    </ProvideMediaMatchers>
  );

  return {
    queries,
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
    Consumer: MediaContext.Consumer,
  };
}
