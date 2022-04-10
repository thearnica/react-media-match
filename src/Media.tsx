import * as React from 'react';

import { BoolOf, MediaRulesOf } from './types';

export interface BoolHash {
  [key: string]: boolean;
}

export interface IQuery {
  [key: string]: string | boolean;
}

export interface MediaProps {
  queries: IQuery;
  children: (matches: BoolHash) => React.ReactNode;
}

export interface MediaState {
  matches: BoolHash;
  matchers: {
    [key: string]: MediaQueryList;
  };
  keys: string[];
}

const matchWindowMedia = (query: string) => {
  if (typeof window === 'object' && window.matchMedia) {
    return window.matchMedia(query).matches;
  }

  return false;
};

export function executeMediaQuery<T>(queries: MediaRulesOf<T>): BoolOf<T> {
  const matches: BoolOf<T> = {} as any;

  Object.keys(queries).forEach((media) => {
    const query = (queries as any)[media];

    (matches as any)[media] = typeof query === 'string' ? matchWindowMedia(query) : query;
  });

  return matches;
}

export class Media extends React.Component<MediaProps, MediaState> {
  public state: MediaState = {
    matches: {},
    matchers: {},
    keys: [],
  };

  constructor(props: MediaProps) {
    super(props);

    if (typeof window !== 'object' || !window.matchMedia) {
      return;
    }

    const { queries } = props;
    const keys = Object.keys(queries);
    this.state.keys = keys;

    Object.keys(queries).forEach((media) => {
      const query = queries[media];

      if (typeof query === 'string') {
        this.state.matches[media] = (this.state.matchers[media] = window.matchMedia(query)).matches;
      } else {
        this.state.matches[media] = query as boolean;
      }
    });
  }

  public updateMatches = () =>
    this.setState(({ keys, matchers, matches }) => ({
      matches: keys.reduce(
        (acc: BoolHash, key) => {
          acc[key] = matchers[key].matches;

          return acc;
        },
        {
          ...matches,
        }
      ),
    }));

  public componentDidMount() {
    const { matchers } = this.state;
    Object.keys(matchers).forEach((match) => matchers[match].addListener(this.updateMatches));
  }

  public componentWillUnmount() {
    const { matchers } = this.state;
    Object.keys(matchers).forEach((match) => matchers[match].removeListener(this.updateMatches));
  }

  public render() {
    const { children } = this.props;
    const { matches } = this.state;

    return children(matches);
  }
}
