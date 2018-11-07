import * as React from 'react';
import {Component} from 'react';
import {
  ProvideMediaMatchers,
  MediaMatcher,
  InlineMediaMatcher,
  pickMatch,
  MediaMatches,
  MediaMock,
  MediaServerRender,
  createMediaMatcher, Above, Below
} from "../src";

export interface AppState {

}

const SecodaryMedia = createMediaMatcher({
  'mobile': '(max-width: 600px)',
  'tablet': '(max-width: 900px)',
  'desktop': '(min-width: 700px)',
})

let cntcnt=0;

class Counter extends React.Component {
  private cnt = 1

  render(){
    return <span>{this.cnt++} {cntcnt++}</span>;
  }
}

export default class App extends Component <{}, AppState> {
  state: AppState = {}

  render() {
    return (
      <ProvideMediaMatchers>
        <div>
          <Above mobile>
            see me only ABOVE mobile
          </Above>
          <br/>
          <Above including mobile>
            see me only ABOVE +mobile
          </Above>
          <br/>
          <Above tablet>
            see me only ABOVE tablet
          </Above>
          <br/>
          <Above including tablet>
            see me only ABOVE +tablet
          </Above>
          <br/>
          <Below tablet>
            see me only BELOW tablet
          </Below>
          <br/>
          <Below including tablet>
            see me only BELOW +tablet
          </Below>
          <br/>
          <Below desktop>
            see me only BELOW desktop
          </Below>
          <br/>
          displaying all 3 (should be the same, and reflect active media):
          <br/>
          <MediaMatcher
            mobile={"mobile"}
            tablet={"tablet"}
            desktop={"desktop"}
          />|
          <InlineMediaMatcher
            mobile={"mobile"}
            tablet={"tablet"}
            desktop={"desktop"}
          />|
          <MediaMatches>
            {matches => (
              <span> = {pickMatch(matches, {
                mobile: "mobile",
                tablet: "tablet",
                desktop: "desktop",
              })}</span>
            )}
          </MediaMatches> ===
          <MediaMatches>
            {(_,pickMatch) => (
              <span> = {pickMatch({
                mobile: "mobile",
                tablet: "tablet",
                desktop: "desktop",
              })}</span>
            )}
          </MediaMatches>

          <br/>
          tablet as maximum:
          <br/>
          <MediaMatcher
            mobile={"mobile"}
            tablet={"tablet"}
          />|
          <InlineMediaMatcher
            mobile={"mobile"}
            tablet={"tablet"}
          />|
          <MediaMatches>
            {matches => (
              <span> = {pickMatch(matches, {
                mobile: "mobile",
                tablet: "tablet",
              })}</span>
            )}
          </MediaMatches>

          <br/><br/>
          While this should always be tablet (it is mocked):
          <MediaMock tablet={true}>
            <MediaMatcher
              mobile={"mobile"}
              tablet={"tablet"}
              desktop={"desktop"}
            />
          </MediaMock>

        </div>
        <br/><br/>
        Overlapping
        <div>
          <SecodaryMedia.Provider>
            <SecodaryMedia.Matcher
              mobile={<span>m<MediaMatcher mobile="m" tablet="t" desktop="d"/></span>}
              tablet={<span>t<MediaMatcher mobile="m" tablet="t" desktop="d"/></span>}
              desktop={<span>d<MediaMatcher mobile="m" tablet="t" desktop="d"/></span>}
            />
          </SecodaryMedia.Provider>
        </div>

        SSR
        <div>


          <MediaServerRender predicted="desktop">
            <MediaMatcher
              mobile={<span>mobile<Counter/></span>}
              tablet={<span>tablet<Counter/></span>}
              desktop={<span>desktop<Counter/></span>}
            />
          </MediaServerRender>


        </div>

        <div>
          <MediaServerRender predicted="desktop" hydrated>
            <MediaMatcher
              mobile={<span>mobile<Counter/></span>}
              tablet={<span>tablet<Counter/></span>}
              desktop={<span>desktop<Counter/></span>}
            />
          </MediaServerRender>
        </div>
      </ProvideMediaMatchers>
    )
  }
}