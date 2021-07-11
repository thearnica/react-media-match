# react-media-match

[![Build Status](https://travis-ci.org/thearnica/react-media-match.svg?branch=master)](https://travis-ci.org/thearnica/react-media-match)
[![coverage-badge](https://img.shields.io/codecov/c/github/thearnica/react-media-match.svg?style=flat-square)](https://codecov.io/github/thearnica/react-media-match)
[![NPM version](https://img.shields.io/npm/v/react-media-match.svg)](https://www.npmjs.com/package/react-media-match)
[![bundle size](https://badgen.net/bundlephobia/minzip/react-media-match)](https://bundlephobia.com/result?p=react-media-match)
[![downloads](https://badgen.net/npm/dm/react-media-match)](https://www.npmtrends.com/react-media-match)
[![Greenkeeper badge](https://badges.greenkeeper.io/thearnica/react-media-match.svg)](https://greenkeeper.io/)

Media targets and "sensors" are not toys - they define the **state** of your Application. Like a Finite **State Machine** `state`.
Handle it holistically. Do not use react media query - use media match.

- 📦 all required matchers are built in
- 🐍 mobile-first "gap-less", and (!)**bug-less** approach.
- 💻 SSR friendly. Customize the target rendering mode and `SSR` for any device.
- 💡 Provides `Media Matchers` to render Components and `Media Pickers` to pick a value depending on the current media.
- 🎣 Provide `hooks` interface for `pickers`
- 🧠 Good typing out of the box - written in TypeScript
- 🚀 more performant than usual - there is only one top level query
- 🧨 Controllable matchers

### Sandbox

https://codesandbox.io/s/react-media-match-example-g28y3

# Usage

Use prebuild matchers or define your own

```js
// custom
import { createMediaMatcher } from 'react-media-match';
const customMatcher = createMediaMatcher({
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
});

// prebuild
import {
  breakpoints,
  orientation,
  darkMode,
  hover,
  reducedMotion,
  // what else?
} from 'react-media-match/targets';

// ...
orientation.useMedia({
  portrait: '📱',
  landscape: '💻', // (well, actually not, but yes)
});
```

## Rules

- **Rule 1**: Don't mix **concerns**

You shall never mix `size` and `orientation`, `hover` and `reduced-motion` - they are different **slices** of a one big state.

💡 If you need to respond to `screen size` and `orientation` - create 2 separate matchers, and use them separately!

- **Rule 2**: Don't match explicit target - think in states
  For the every case you might have two or more `states`, only one of which can be active in a single point of view
  - mobile/tablet/desktop - who you are,
  - portrait/landscape - how you are holding it
  - hover/no-hover - there is no way they both can be true
  - and visa versa.

👉 Each Media Query should be responsible only for a single `dimension` - width, height, hover or orientation.

- **Rule 3**: Intervals
  Started with desktop and mobile? Then added tablet? Then added small mobile, and then large desktop? You shall be ready for a change.
  All API in react-media-matcher follow the **pick value to the left** pattern, making impossible situations when you might miss a target.

👉 **Pick value to the left** is the core concept. It protects you from mistakes, and allows to skip intermediate resolutions, if they should inherit styles from "lesser" query.

- **Rule 4**: Match all rules at once
  Every matcher should match only one consern, and every matcher should handle all possible variations **simultaneously** - it's not about what do to in case of mobile, it's also what to do in any other case.

👉 The core idea is to use object hashes to define how something should look **on all targets**, protecting from wide bug variations and making everything more declarative and readable.

## Usage

```sh
npm install react-media-match

yarn add react-media-match
```

- render "forking"

```jsx
<MediaMatcher
  mobile={'render for mobile'}
  // tablet={"tablet"} // mobile will be rendered for a "skipped" tablet - "pick value to the left"
  desktop={'render desktop'}
/>
```

- hook interface

```js
const title = useMedia({
  mobile: shortName,
  tablet: name,
  // desktop: tablet will be used
});
```

- custom media

```js
const Orientation = createMediaMatcher({
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
});

const height = Orientation.useMedia({
  portrait: "50vw",
  landscape: "50vw"
});
<Orientation.Matcher portrait="One" landscape="Second" />;
<Orientation.ServerRender portrait="rendering on portrait" landscape="rendering on landscape" />;
```

### More examples of usage

```js
import { MediaMatcher, ProvideMediaMatchers } from 'react-media-match';

// this component will calculate all Media's and put data into the React Context
// if you will not provide it - values would be caclucaed only once, on the application start
// keep in mind - some values (like hoverability) could not change, and it's legal to skip some providers.
<ProvideMediaMatchers>
  <MediaMatcher
    mobile={'render for mobile'}
    // tablet={"tablet"} // mobile will be rendered for "skipped" tablet
    desktop={'render desktop'}
  />
  <MediaMatcher
    mobile={'render for mobile'}
    tablet={null} // nothing will be rendered for tablet, as long you clearly "defined" it
    desktop={'render desktop'}
  />
  // there are also "Range" Components
  <Above mobile>will be rendered on tablet and desktop</Above>
  <Below desktop>will be rendered on mobile and tablet</Above>
  <Below including desktop>
    will be rendered on mobile, tablet and desktop
  </Below>
  <MediaMatches>
    {' '}
    // will provide matches information via render-props
    {(matches) => (
      <span>
        {' '}
        testing {
          // pick matching values
          pickMatch(matches, {
            mobile: 'mobile',
            // tablet: "tablet", // the same rules are applied here
            desktop: 'desktop',
          })
        }
      </span>
    )}
  </MediaMatches>
  <MediaMatches>
    {' '}
    // will provide matches information via render-props
    {(
      _,
      pickThisMatch // you can get pickMatch from MediaMatches
    ) => (
      <span>
        {' '}
        testing {
          // pick matching values, there is no need to provide "matches"
          pickThisMatch({
            mobile: 'mobile',
            // tablet: "tablet", // the same rules are applied here
            desktop: 'desktop',
          })
        }
      </span>
    )}
  </MediaMatches>
  // there is also "hooks" API for pickMatch
</ProvideMediaMatchers>;
```

PS: Don’t forget to **wrap all this with ProvideMediaMatchers** - without it MediaMatches will always picks the "last" branch.

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
  - `ServerRender`
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
import { createMediaMatcher } from 'react-media-match';

const Orientation = createMediaMatcher({
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
});

<Orientation.Match portrait="One" landscape="Second" />;
```

### Usage with hooks

Keep in mind - only _value picker_ should be used as a hook, the _render selection_ should
be declarative and use `MediaMatcher`.

```js
const MyComponent = ({ shortName, name }) => {
  const title = useMedia({
    mobile: shortName,
    tablet: name,
  });

  return <span>Hello {title}</span>;
};
```

### Usage in life cycle events

> Requires React16.6+

```js
import { MediaConsumer, pickMatch } from 'react-media-match';
// use createMediaMatcher to create your own matches

class App extends React.Component {
  // provide Consumer as a contextType
  static contextType = MediaConsumer;

  componentDidMount() {
    // use `pickMatch` matching the consumer
    pickMatch(this.context, {
      mobile: 'a',
      tablet: 'b',
    });
  }
}
```

## Top level provider

If you want to react to a _media change_ you **have** to wrap your application with `ProvideMediaMatchers`.
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
  touchDevice: '(hover: none)',
  mouseDevice: '(hover: hover)',
});

const MyComponent = () => {
  const autoFocus = HoverMedia.useMedia({
    touchDevice: false,
    mouseDevice: true,
  });

  return <input autoFocus={autoFocus} />;
};
```

## Server-Side Rendering

There is no way to support MediaQuery on the Server Side, so the only way to generate the expected result
is **to mock** a predicted device.

We are providing a special component which will

- render data in predicted device on server side,
- hydrate into it on the client side
- switch to the real values after initial hydration

```js
import { MediaMatcher, MediaServerRender } from 'react-media-match';

<MediaServerRender predicted="desktop" hydrated={optionallyTrue}>
  <MediaMatcher
    mobile={'render for mobile'}
    // tablet={"tablet"} // mobile will be rendered for "skipped" tablet
    desktop={'render desktop'}
  />
</MediaServerRender>;
```

- set `hydrated` to `true` if your application is already _hydrated_ by any reason. **Omit** the field to let
  `MediaServerRender` handle hydration process automatically.

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

Just provide `state` for ProvideMediaMatchers, and it will control all the nested matchers. Could be used to provide **not media-based** rules.

- `ProvideMediaMatchers` has a `state` parameter, and you might specify it override any information, and control all the nested matchers.
- `MediaMock` will completely mock media settings.

Both mocks are not working for `Inline` component.

Testing and mocking are related to SSR rendering, and you may use MediaServerRender for tests and Mocks for SSR as well.

## See also

- [react-media-query-hoc](https://github.com/DomainGroupOSS/react-media-query-hoc) implements the same idea of SSR friendly and Multiple-breakpoints approach.

## Articles

- Dev.to article - [Take the Responsivebility](https://dev.to/thekashey/take-the-responsivebility-3m8f)
- Medium article - [Adaptive?! Responsive? Reactive!](https://medium.com/@antonkorzunov/adaptive-responsive-reactive-62fb938d6191)
- Spectrum chat - [React-Media-Match](https://spectrum.chat/thread/2057cb44-ddd7-4fb2-98f8-c1d697bcf62d)

## License

MIT
