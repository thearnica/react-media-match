# react-media-match

[![Build Status](https://travis-ci.org/thearnica/react-media-match.svg?branch=master)](https://travis-ci.org/thearnica/react-media-match)
[![coverage-badge](https://img.shields.io/codecov/c/github/thearnica/react-media-match.svg?style=flat-square)](https://codecov.io/github/thearnica/react-media-match)
[![NPM version](https://img.shields.io/npm/v/react-media-match.svg)](https://www.npmjs.com/package/react-media-match)


__Mobile first__ react responsive framework made easy.

 - 🐍 "mobile-first", "gap-less", and bug-less rendering.
   - In all the cases one rendering branch will be picked, and only one!
   - Never forget to render something, never render two branches simultaneously.
 - 💻 SSR friendly. Customize the target rendering mode, and `SSR` for any device.
 - 💡 Provides Media Matchers and Media Pickers. Render different components based on media, or calculate strings.
 - 🧠 written in TypeScript
 - 🌩 just 1.5kb

 ## Usage

 ```sh
 npm install react-media-match

 yarn add react-media-match
 ```

Just:
1. Define once all your media queries (2-3-4 usual), and then use them _simultaneously_!
2. Define how application should look like on all resolutions.

Each Media Query is responsible only for a single "dimension" - width, height or orientation.
- If you have defined what Query should render on _mobile_, but not everything else - it will always use mobile.
- defined _mobile_ and _desktop_, but not _tablet_ or _laptop_? It will use "value to the left".

"Pick value to the left" is the core concept. It protects you from mistakes, and allows to skip intermediate resolutions, if they should inherit styles from "lesser" query.

- If you need to respond to screen size and orientation - create 2 separate matchers, and work with them - separately!
- If you need to respond to NOT screen or NOT media - just _provide_ values MediaMatcher should match against and that's done!

react-media-match was made with maintainability and mobile first approach in mind. It makes things simpler.

react-media-match provides two components and one function, and none of them awaits query as a prop,

```js
import { MediaMatcher, ProvideMediaMatchers } from "react-media-match";

<ProvideMediaMatchers> // this component will calculate all Media's and put data into the React Context
    <MediaMatcher
        mobile={"render for mobile"}
        // tablet={"tablet"} // mobile will be rendered for "skipped" tablet
        desktop={"render desktop"}
    />
    <MediaMatcher
        mobile={"render for mobile"}
        tablet={null} // nothing will be rendered for tablet, as long you clearly defined it
        desktop={"render desktop"}
    />

    <MediaMatches> // will provide matches information via render-props
        {matches => (
            <span> testing {
                // pick matching values
                pickMatch(matches, {
                    mobile: "mobile",
                    // tablet: "tablet", // the same rules are applied here
                    desktop: "desktop",
                })
            }</span>
        )}
    </MediaMatches>

    <MediaMatches> // will provide matches information via render-props
            {(_,pickMatch) => ( // you can get pickMatch from MediaMatches
                <span> testing {
                    // pick matching values
                    pickMatch({
                        mobile: "mobile",
                        // tablet: "tablet", // the same rules are applied here
                        desktop: "desktop",
                    })
                }</span>
            )}
        </MediaMatches>
</ProvideMediaMatchers>
```
PS: Don’t forget to __wrap all this with ProvideMediaMatchers__ - without it MediaMatches will always picks the "last" branch.

## Server-Side Rendering

There is no way to support MediaQuery on the Server Side, so the only way to generate the expected result
is __to mock__ a predicted device.

We are providing a special component which will mock data only on server size,
and compare predicted media on componentMount on client size.

It also has a special prop `hydrated` which will lead to __forced react tree remount__
in case prediction was wrong, and rendered tree will not match hydrated one.
(use only in case of `ReactDOM.hydrated`)

```js
import { MediaMatcher, MediaServerRender } from "react-media-match";

<MediaServerRender predicted="desktop" hydrated>
    <MediaMatcher
        mobile={"render for mobile"}
        // tablet={"tablet"} // mobile will be rendered for "skipped" tablet
        desktop={"render desktop"}
    />
</MediaServerRender>
```
If prediction has failed - it will inform you, and might help to mitigate rendering issues.

#### How to predict device type

You may use [ua-parser-js](https://github.com/faisalman/ua-parser-js), to detect device type, and pick desired screen resolution, or use [react-ugent](https://github.com/medipass/react-ugent) to make it a bit
more declarative.

## API

 react-media-match provides an API for "default" queries, and a factory method to create custom media queries.

 - `createMediaMatcher(breakPoints: { key: string })` - factory for a new API for provided breakpoints.
 The object with following props will be returned:
   - pickMatch
   - Matches
   - Matcher
   - Provider
   - Mock
   - SSR

 There is also pre-exported API for default breakpoints - mobile, tablet, desktop

 - `pickMatch(matches, matchers)` - function, return value from matchers matching matches.

 - `ProvideMediaMatchers` - component, calculates media queries and stores them in context.

 - `MediaMatches` - component, returns current matchers as a render prop

 - `MediaMatcher` - component, renders path for active match

 - `MediaServerRender` - component, helps render server-size

## Example
 - Define secondary Query for orientation
```js
import { createMediaMatcher } from "react-media-match";

 const Orientation = createMediaMatcher({
   portrait: "(orientation: portrait)",
   landscape: "(orientation: landscape)"
 });

 <Orientation.Match
   portrait="One"
   landscape="Second"
 />
```
 - Define query based on user settings
 ```js
 import { MediaMock, ProvideMediaMatchers } from "react-media-match";

 // override all data
 <ProvideMediaMatchers state={{mobile:true, tablet:false, desktop:false}}>
    ....
 </ProvideMediaMatchers>

 <MediaMock mobile>
     ....
 </MediaMock>

 <Orientation.Mock portrait>
     ....
 </Orientation.Mock>
 ```

### Sandbox

https://codesandbox.io/s/o7q3zlo0n9

# Testing and Mocking
Just provide `state` for ProvideMediaMatchers, and it will control all the nested matchers. Could be used to provide __not media-based__ rules.

 - `ProvideMediaMatchers` has a `state` parameter, and you might specify it override any information, and control all the nested matchers.
 - `MediaMock` will completely mock media settings.

 Both mocks are not working for `Inline` component.

 Testing and mocking are related to SSR rendering, and you may use MediaServerRender for tests and Mocks for SSR as well.


## Articles

- Medium article - [Adaptive?! Responsive? Reactive!](https://medium.com/@antonkorzunov/adaptive-responsive-reactive-62fb938d6191)
- Spectrum chat - [React-Media-Match](https://spectrum.chat/thread/2057cb44-ddd7-4fb2-98f8-c1d697bcf62d)

## License

MIT
