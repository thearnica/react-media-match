import * as React from "react";

export type BoolHash = { [key: string]: boolean };

export interface IQuery {
  [key: string]: string;
}

export interface MediaProps {
  queries: IQuery,
  children: (matches: BoolHash) => React.ReactNode;
}

export interface MediaState {
  matches: BoolHash,
  matchers: {
    [key: string]: MediaQueryList;
  },
  keys: string[];
}

export const executeMediaQuery = (queries: IQuery) => {
  const matches: BoolHash = {};
  if (!(typeof window !== "object" || !window.matchMedia)) {
    if (window) {
      Object
        .keys(queries)
        .forEach(media => {
          matches[media] = window.matchMedia(queries[media]).matches;
        });
    }
  }
  return matches;
};

export class Media extends React.Component<MediaProps, MediaState> {

  state: MediaState = {
    matches: {},
    matchers: {},
    keys: [],
  };

  constructor(props: MediaProps) {
    super(props);

    if (typeof window !== "object" || !window.matchMedia) return;

    const {queries} = props;
    const keys = Object.keys(queries);
    this.state.keys = keys;
    Object
      .keys(queries)
      .forEach(media => {
        this.state.matches[media] = (this.state.matchers[media] = window.matchMedia(queries[media])).matches;
      });
  }

  updateMatches = () => this.setState(({keys, matchers}) => ({
    matches: keys.reduce((acc: BoolHash, key) => {
      acc[key] = matchers[key].matches;
      return acc;
    }, {})
  }));

  componentDidMount() {
    const {keys, matchers} = this.state;
    keys.forEach(key => matchers[key].addListener(this.updateMatches));
  }

  componentWillUnmount() {
    const {keys, matchers} = this.state;
    keys.forEach(key => matchers[key].removeListener(this.updateMatches));
  }

  render() {
    const {children} = this.props;
    const {matches} = this.state;

    return children(matches)
  }
}
