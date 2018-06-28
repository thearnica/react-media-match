import * as React from "react";

export interface MediaProps {
  query: string,
  children: (match: boolean | undefined) => React.ReactNode;
}

export class Media extends React.Component<MediaProps, {
  matches: (boolean | undefined)
}> {

  state = {
    matches: undefined as any
  };

  mediaQueryList: MediaQueryList | null = null;

  constructor(props: MediaProps) {
    super(props);

    if (typeof window !== "object" || !window.matchMedia) return;

    this.mediaQueryList = window.matchMedia(this.props.query);
    this.state.matches = this.mediaQueryList.matches;
  }

  updateMatches = () => this.setState({matches: this.mediaQueryList!.matches});

  componentDidMount() {
    if (this.mediaQueryList) {
      this.mediaQueryList.addListener(this.updateMatches);
    }
  }

  componentWillUnmount() {
    if (this.mediaQueryList) {
      this.mediaQueryList.removeListener(this.updateMatches);
    }
  }

  render() {
    const {children} = this.props;
    const {matches} = this.state;

    return children(matches)
  }
}