import { Consumer, FC, ReactNode } from 'react';

export type RenderMatch<T, K> = (matches: BoolOf<T>, pickMatch: (matches: Partial<ObjectOf<T, K>>) => K) => ReactNode;

export type ObjectOf<T, K> = { [P in keyof T]: K };

export type MediaRule = string;

export type MediaRulesOf<T> = ObjectOf<T, MediaRule> | ObjectOf<T, boolean>;

export type BoolOf<T> = ObjectOf<T, boolean>;

export type RenderOf<T> = ObjectOf<T, ReactNode>;

export interface Including {
  including?: boolean;
}

export interface NoChildren {
  children?: never;
}

export interface MediaMatcherType<T> {
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
  Matches: FC<{ children: RenderMatch<T, any> }>;
  /**
   * an isolated version of {@link Matches}.
   * DOES NOT USES GLOBAL STATE
   * Not affected by {@link Mock}, {@link Override} or {@link ServerRender}
   *
   * @deprecated
   */
  Inline: FC<Partial<RenderOf<T>>>;

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
  Provider: FC<{ state?: BoolOf<T> }>;
  /**
   * ! to be used for testing and server side rendering !
   *
   * Replaces a whole state with a provided values
   * expects arguments to be keys: as given, values: boolean
   *
   * @see {Provider}
   */
  Mock: FC<Partial<RenderOf<T>>>;
  /**
   * ! to be used for testing and server side rendering !
   *
   * The same as {@link Mock}, but replaces only a part of a state
   *
   * @see {Mock}
   */
  Override: FC<Partial<RenderOf<T>>>;

  /**
   * A Server side helper - accepts a "predicted" target (the one used during SSR)
   * and if it does not match - safely remounts the app
   */
  ServerRender: FC<{ predicted: keyof T; hydrated?: boolean; children: ReactNode }>;

  /**
   * Renders given children only on states Below(or +including) given
   * @example
   * <breakpoints.Below tablet>Probably mobile</breakpoints.Below>
   */
  Below: FC<Partial<BoolOf<T>> & Including>;
  /**
   * Renders given children only on states Above(or +including) given
   * @example
   * <breakpoints.Above tablet including>Probably not mobile</breakpoints.Above>
   */
  Above: FC<Partial<BoolOf<T>> & Including>;

  /**
   * renders only one matching path
   * @example
   * <Matcher
   *   mobile="render mobile"
   *   tablet="render on anything above"
   * />
   */
  Matcher: FC<Partial<RenderOf<T>>>;

  /**
   * @deprecated
   */
  Gearbox: Consumer<Partial<BoolOf<T>>>;
  /**
   * @deprecated
   */
  Consumer: Consumer<Partial<BoolOf<T>>>;
  // pickers

  /**
   * Picks value from Slots for matching Match)
   * @type {<K>(matches: BoolOf<T>, slots: ObjectOf<T, K>) => K}
   * @see {useMedia}
   */
  pickMatch<K>(matches: BoolOf<T>, slots: Partial<ObjectOf<T, K>>): K;
  /**
   * React hook - returns the current state
   * @see {pickMatch}
   */
  useMedia<K>(slots: Partial<ObjectOf<T, K>>): K | null;
}
