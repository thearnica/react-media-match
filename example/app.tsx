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
  createMediaMatcher, Above, Below,
  useMedia,
} from "../src";

export interface AppState {

}

const SecodaryMedia = createMediaMatcher({
  'mobile': '(max-width: 600px)',
  'tablet': '(max-width: 900px)',
  'desktop': '(min-width: 700px)',
});

const HoverMedia = createMediaMatcher({
  touchDevice: "(hover: none)",
  mouseDevice: "(hover: hover)",
});

const FixedMedia = createMediaMatcher({
  true: true,
  false: false,
});

let cntcnt = 0;

class Counter extends React.Component {
  private cnt = 1

  render() {
    return <span>{this.cnt++} {cntcnt++}</span>;
  }
}

const HookTest = () => {
  const displayedMedia = useMedia({
    mobile: 'mobile',
    tablet: 'tablet',
    desktop: 'desktop'
  });

  return <span>this is {displayedMedia}</span>;
};

const HoverHookTest = () => {
  const displayedMedia = HoverMedia.useMedia({
    touchDevice: 'touch',
    mouseDevice: 'mouse',
  });

  return <span>this is {displayedMedia} (without provider)</span>;
};

const FixedHookTest = () => {
  const fixed = FixedMedia.useMedia({
    true: 'true',
    false: 'false',
  });

  return <span>fixed {fixed}</span>;
};

export default class App extends Component <{}, AppState> {
  state: AppState = {};

  render() {
    return (
      <ProvideMediaMatchers>
        <HookTest/>

        <br/>
        <HoverHookTest/>
        <br/>
        <FixedHookTest/>
        <FixedMedia.Provider>
          <FixedHookTest/>
        </FixedMedia.Provider>
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
            {(_, pickMatch) => (
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

          <br/><br/>
          And this also:
          <MediaMock tablet={true}>
            <ProvideMediaMatchers>
              <MediaMatcher
                mobile={"mobile"}
                tablet={"tablet"}
                desktop={"desktop"}
              />
            </ProvideMediaMatchers>
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