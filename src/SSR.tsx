import * as React from "react";

const PassThrought: any = ({children}: { children: React.ReactNode }) => children;

export class MediaServerSide extends React.Component<{
  predicted: string,
  fact: string,
  hydrated: boolean;
  children: React.ReactNode
}, {
  key: string
}> {
  state = {
    key: 'media-as-predicted'
  };

  componentDidMount() {
    const {fact, predicted, hydrated } = this.props;
    if (fact && fact !== predicted) {
      if(hydrated) {
        this.setState({
          key: 'media-prediction-failed'
        })
      }
      console.error(`React-media-match: SSR failed "${predicted}" was predicted, while "${fact}" seen by fact.`)
    }
  }

  render() {
    return <PassThrought key={this.state.key}>{this.props.children}</PassThrought>
  }
}