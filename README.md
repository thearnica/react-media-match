# react-media-match

[![Build Status](https://travis-ci.org/thearnica/react-media-match.svg?branch=master)](https://travis-ci.org/thearnica/react-media-match)
[![coverage-badge](https://img.shields.io/codecov/c/github/thearnica/react-media-match.svg?style=flat-square)](https://codecov.io/github/thearnica/react-media-match)
[![NPM version](https://img.shields.io/npm/v/react-media-match.svg)](https://www.npmjs.com/package/react-media-match)
[![bundle size](https://badgen.net/bundlephobia/minzip/react-media-match)](https://bundlephobia.com/result?p=react-media-match)
[![downloads](https://badgen.net/npm/dm/react-media-match)](https://www.npmtrends.com/react-media-match)
[![Greenkeeper badge](https://badges.greenkeeper.io/thearnica/react-media-match.svg)](https://greenkeeper.io/)

Media targets and "sensors" are not toys - they define the __state__ of your Application. Like the Finite __State Machine__ state. Thus - firstly don't mix __conserns__, and secondary - handle it as a whole.

 - 🐍 mobile-first "gap-less", and (!)__bug-less__ approach.
 - 💻 SSR friendly. Customize the target rendering mode and `SSR` for any device.
 - 💡 Provides `Media Matchers` to render Components and `Media Pickers` to pick a value depending on the current media.
 - 🎣 Provide `hooks` interface for `pickers`
 - 🧠 Good typing out of the box - written in TypeScript
 - 🚀 more performant than usual - there is only one top level query
 - 🧨 Controllable matchers

 ## Usage

 ```sh
 npm install react-media-match

 yarn add react-media-match
 ```

The core idea is to use object hashes to define how something should look __on all targets__, protecting from wide bug variations and making everything more declarative and readable.

```jsx
// MediaMatcher defines a "fork" for all media targets __simultaneously__ - coherence and collocation

<MediaMatcher
    mobile={"render for mobile"}
    // tablet={"tablet"} // mobile will be rendered for a "skipped" tablet - "pick value to the left"
    desktop={"render desktop"}
/>
```

- You shall never mix `size` and `orientation`, `hover` and `reduced-motion` - they are different __slices__ of a one big state.
- For the every case you might have two or more __intervals__ - mobile/tablet/desktop, or portrait/landscape, or hover/no-hover, and visa versa.
- Every matcher should match only one consern, and every matcher should handle all possible variations __simultaneously__ - situation when you forgot to handle some __edge case__ is just not possible.

### Sandbox

https://codesandbox.io/s/o7q3zlo0n9

### Concepts
Just:
- Define once all your media queries (2-3-4 usual), and then use them _simultaneously_!
- Define how application should look like on all resolutions.

Each Media Query is responsible only for a single `dimension` - width, height or orientation.
- If you have defined what Query should render on _mobile_, but not everything else - it will always use mobile.
- defined _mobile_ and _desktop_, but not _tablet_ or _laptop_? It will use "value to the left".

__Pick value to the left__ is the core concept. It protects you from mistakes, and allows to skip intermediate resolutions, if they should inherit styles from "lesser" query.

> If you need to respond to `screen size` and `orientation` - create 2 separate matchers, and work with them - separately!

```js
import { MediaMatcher, ProvideMediaMatchers } from "react-media-match";

// this component will calculate all Media's and put data into the React Context
// if you will not provide it - values would be caclucaed only once, on the application start
// keep in mind - some values (like hoverability) could not change, and it's legal to skip some providers.
<ProvideMediaMatchers> 
    <MediaMatcher
        mobile={"render for mobile"}
        // tablet={"tablet"} // mobile will be rendered for "skipped" tablet
        desktop={"render desktop"}
    />
    <MediaMatcher
        mobile={"render for mobile"}
        tablet={null} // nothing will be rendered for tablet, as long you clearly "defined" it
        desktop={"render desktop"}
    />
    
    // there are also "Range" Components
    <Above mobile>will be rendered on tablet and desktop</Above>
    <Below desktop>will be rendered on mobile and tablet</Above>
    <Below including desktop>will be rendered on mobile, tablet and desktop</Above>

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
       {(_,pickThisMatch) => ( // you can get pickMatch from MediaMatches
           <span> testing {
               // pick matching values, there is no need to provide "matches"
               pickThisMatch({
                   mobile: "mobile",
                   // tablet: "tablet", // the same rules are applied here
                   desktop: "desktop",
               })
           }</span>
       )}
    </MediaMatches>
    
    // there is also "hooks" API for pickMatch
</ProvideMediaMatchers>
```
PS: Don’t forget to __wrap all this with ProvideMediaMatchers__ - without it MediaMatches will always picks the "last" branch.

## API

 react-media-match provides an API for "default" queries, and a factory method to create custom media queries.

 - `createMediaMatcher(breakPoints: { key: string })` - factory for a new API for provided breakpoints.
 The object with following keys will be returned:
   - `pickMatch`
   - `useMedia`
   - `Matches`
   - `Matcher`
   - `Provider`
   - `Mock`
   - `SSR`
   - `Consumer`

## Default API

 There is also pre-exported API for default breakpoints - `mobile`, `tablet`, `desktop`

 - `pickMatch(mediaMatches, matchers)` - function, returns value from matchers matching `matchers`.
 
 - `useMatch(matchers)` - hook, returns value from matchers matching matches. This call is equal to `pickMatch` with autowired context.

 - `ProvideMediaMatchers` - component, calculates media queries and stores them in context.

 - `MediaMatches` - component, returns current matchers as a render prop

 - `MediaMatcher` - component, renders path for active match 
 
 - `Above` - component, renders children above specified point. Or including specified point if `including` prop is set. 
 
 - `Below` - component, renders children below specified point. Or including specified point if `including` prop is set.

 - `MediaServerRender` - component, helps render server-size
 
 - `MediaConsumer` - React Context Consumer

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
 
### Usage with hooks
Keep in mind - only _value picker_ should be used as a hook, the _render selection_ should
be declarative and use `MediaMatcher`.
```js
const MyComponent = ({shortName, name}) => {
  const title = useMedia({
    mobile: shortName,
    tablet: name,
  });
  
  return <span>Hello {title}</span>
}
```
 
### Usage in life cycle events
> Requires React16.6+
```js
import {MediaConsumer, pickMatch} from 'react-media-match';
// use createMediaMatcher to create your own matches

class App extends React.Component {
  
  // provide Consumer as a contextType
  static contextType = MediaConsumer;
  
  componentDidMount() {
    // use `pickMatch` matching the consumer
    pickMatch(this.context, {
      mobile: 'a',
      tablet: 'b'
    })
  }
}
```

## Top level provider
If you want to react to a _media change_ you __have__ to wrap your application with `ProvideMediaMatchers`.
But if you don't - you might skip this moment.

### For example - media for "device pointer type"
Mobile phones(touch devices) don't have "hover" effects, while the onces with `mouse` - do support it.
More of it - this could not be changed in runtime - device type is constant.

This information might be quite important - for example you might control _autoFocus_, as long as 
_auto-focusing_ input on a _touch_ device would open a `virtual keyboard`(consuming 50% of the screen), which may be
not desired.

In this case you might omit `ProvideMediaMatchers` and use _default_ values, which would be computed on start time.  
```js
const HoverMedia = createMediaMatcher({
  touchDevice: "(hover: none)",
  mouseDevice: "(hover: hover)",
});

const MyComponent = () => {
  const autoFocus = HoverMedia.useMedia({
    touchDevice: false,
    mouseDevice: true,
  });
  
  return <input autoFocus={autoFocus}/>
}
```
 
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

#### How to predict a device type

You may use [ua-parser-js](https://github.com/faisalman/ua-parser-js), to detect device type, and pick desired screen resolution, or use [react-ugent](https://github.com/medipass/react-ugent) to make it a bit
more declarative. 

## Non media based matches
Define query based on user settings
 ```js
 import { MediaMock, ProvideMediaMatchers } from "react-media-match";

 // override all the data
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

# Testing and Mocking
Just provide `state` for ProvideMediaMatchers, and it will control all the nested matchers. Could be used to provide __not media-based__ rules.

 - `ProvideMediaMatchers` has a `state` parameter, and you might specify it override any information, and control all the nested matchers.
 - `MediaMock` will completely mock media settings.

 Both mocks are not working for `Inline` component.

 Testing and mocking are related to SSR rendering, and you may use MediaServerRender for tests and Mocks for SSR as well.


## See also
- [react-media-query-hoc](https://github.com/DomainGroupOSS/react-media-query-hoc) implements the same idea of SSR friendly and Multiple-breakpoints approach. 

## Articles

- Medium article - [Adaptive?! Responsive? Reactive!](https://medium.com/@antonkorzunov/adaptive-responsive-reactive-62fb938d6191)
- Spectrum chat - [React-Media-Match](https://spectrum.chat/thread/2057cb44-ddd7-4fb2-98f8-c1d697bcf62d)

## License

MIT
