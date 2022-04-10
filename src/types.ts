import { Consumer, FC, ReactElement, ReactNode, WeakValidationMap } from 'react';

export type RenderMatch<T, K> = (matches: BoolOf<T>, pickMatch: (matches: Partial<ObjectOf<T, K>>) => K) => ReactNode;

export type ObjectOf<T, K> = { [P in keyof T]: K };

export type MediaRule = string;

export type MediaRulesOf<T> = ObjectOf<T, MediaRule> | ObjectOf<T, boolean>;

export type BoolOf<T> = ObjectOf<T, boolean>;

export type RenderOf<T> = ObjectOf<T, ReactNode>;

export interface Including {
  including?: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ObjectShape = {};

export interface LeafComponent<P = ObjectShape> {
  (props: P): ReactElement<any, any> | null;

  propTypes?: WeakValidationMap<P>;
  displayName?: string;
}

export type WithRequiredKeysSet<T extends ObjectShape, RequiredKey extends keyof T> = Partial<T> & Pick<T, RequiredKey>; // & Partial<Pick<T, Exclude<keyof T, RequiredKey>>>;

export interface MediaMatcherType<T extends ObjectShape, RequiredKey extends keyof T = keyof T> {
  /**
   * list of known matches
   */
  queries: MediaRulesOf<T>;
  /**
   * RenderProp component returning
   * - matches - a current state, an object passable to {@link pickMatch}
   * - pickMatch - a {@link pickMatch} version with pre-filled matches
   * @see {@link useMedia} and {@link pickMatch}
   * @example
   * <Matches>
   *   {(matches, buildInPickMatch) =>
   *     buildInPickMatch({
   *       match1: ...,
   *       match2: ...
   *     })
   *   }
   * </Matches>
   * @example
   * <Matches>
   *   {(matches) =>
   *     pickMatch(matches, {
   *       match1: ...,
   *       match2: ...
   *     })
   *   }
   * </Matches>
   */
  Matches: LeafComponent<{ children: RenderMatch<T, any> }>;
  /**
   * an isolated version of {@link Matches}.
   * DOES NOT USES GLOBAL STATE
   * Not affected by {@link Mock}, {@link Override} or {@link ServerRender}
   *
   * @deprecated
   */
  Inline: LeafComponent<Partial<RenderOf<T>>>;

  // providers
  /**
   * Makes Media Matcher reactive by
   * providing context for underlying consumers
   *
   * Without it matches are __static__.
   * Keep in mind - some targets, like `hover` could be static
   *
   * @example
   * // just wrap your application with it
   * <someMatcher.Provider>
   *   <App />
   * </someMatcher.Provider>
   */
  Provider: FC<{ state?: BoolOf<T>; children: ReactNode }>;
  /**
   * ! to be used for testing and Server Side Rendering !
   *
   * Replaces a whole state with a provided values
   * expects arguments to be keys: as given, values: boolean
   *
   * @see {@link Provider}
   * @see https://github.com/thearnica/react-media-match#non-media-based-matches
   * @example
   * <orientation.Mock landscape={true}>
   *   <App/>
   * </orientation.Mock>
   */
  Mock: FC<Partial<RenderOf<T>> & { children: ReactNode }>;
  /**
   * ! to be used for testing and server side rendering !
   *
   * The same as {@link Mock}, but replaces only a part of a state
   *
   * @see {@link Mock}
   */
  Override: FC<Partial<RenderOf<T>> & { children: ReactNode }>;

  /**
   * A Server side helper - accepts a "predicted" target (the one used during SSR)
   * and if it does not match - safely remounts the app
   */
  ServerRender: FC<{
    predicted: keyof T;
    hydrated?: boolean;
    children: ReactNode;
    onWrongPrediction?(predicted: keyof T, factual: keyof T): void;
  }>;

  /**
   * Renders given children only on states Below(or +including) given
   * @example
   * <breakpoints.Below tablet>
   *   Probably mobile?
   * </breakpoints.Below>
   */
  Below: FC<Partial<BoolOf<T>> & Including & { children: ReactNode }>;
  /**
   * Renders given children only on states Above(or +including) given
   * @example
   * <breakpoints.Above tablet including>
   *     Probably not mobile, but could be tablet
   * </breakpoints.Above>
   */
  Above: FC<Partial<BoolOf<T>> & Including & { children: ReactNode }>;

  /**
   * renders only one matching path
   * @example
   * <Matcher
   *   mobile="render mobile"
   *   tablet="render on anything above"
   * />
   */
  Matcher: LeafComponent<Partial<RenderOf<T>>>;

  /**
   * @deprecated
   */
  Gearbox: Consumer<Partial<BoolOf<T>>>;
  /**
   * @deprecated
   * @internal
   */
  Consumer: Consumer<Partial<BoolOf<T>>>;

  // pickers

  /**
   * Picks value from Slots for matching Match)
   * There are 3 forms of this function
   * - with all slots provided - guaranteed to return something
   * - with non all slots, but with default value - guaranteed to return something
   * - with not all slots - might return undefined
   * @type {<K>(matches: BoolOf<T>, slots: ObjectOf<T, K>) => K}
   * @see {@link useMedia}
   * @example
   *  const match = pickMatch({
   *      server: true // MediaMatcher gives you this variable
   *    }, {
   *      client: "it's frontend?",
   *      server: "that's backend!"
   *    }
   *  ); // == that's backend!
   */
  pickMatch<K>(matches: BoolOf<T>, slots: WithRequiredKeysSet<ObjectOf<T, K>, RequiredKey>): K;

  /**
   * second form of {@link pickMatch}
   * first "slot" is not provided and useMedia might return undefined
   */
  pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K | undefined;

  /**
   * third form of {@link pickMatch}
   * first "slot" is not provided, but there is a default value to use
   */
  pickMatch<K, DK>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>, defaultValue: DK): K | DK;

  /**
   * Matches the current media
   * @see {@link pickMatch}
   * There are 3 forms of this function
   * - with all slots provided - guaranteed to return something
   * - with non all slots, but with default value - guaranteed to return something
   * - with not all slots - might return undefined
   * @example
   * // first form
   * too long long for this example
   * // third form
   * breakpoints.useMedia({
   *   // returns undefined for xxs (!)
   *   xs: "very small",
   *   // everything in between is still xss (match a value to the left)
   *   xl: "very large",
   * })
   * // second form
   * breakpoints.useMedia({
   *   // returns "small" for xxs
   *   xs: "not that small",
   * }, "small")
   */
  useMedia<K>(slots: WithRequiredKeysSet<ObjectOf<T, K>, RequiredKey>): K;

  /**
   * second form of {@link useMedia}
   * first "slot" is not provided and useMedia might return undefined
   */
  useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | undefined;

  /**
   * third form of {@link useMedia}
   * first "slot" is not provided, but there is a default value to use
   */
  useMedia<K, DK>(slots: Partial<ObjectOf<T, K>>, defaultValue: DK): K | DK;
}
