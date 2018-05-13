# react-media-match

[![NPM](https://nodei.co/npm/react-media-match.png?downloads=true&stars=true)](https://nodei.co/npm/react-media-match/)

Mobile first react responsive framework made easy. The main difference from `react-media` - approach itself.

Once define all your media queries (2-3-4 usual), and them use them _simultaneously_! As long this is that you want - define how application should look like on all resolutions. Not one-by-one, as usual.

react-media-match provides 2 components and one function, and no of them awaits query as a prop,

```js
<MediaMatcher
    mobile={"render for mobile"}
    // tablet={"tablet"} // mobile will be rendered for missed tablet
    desktop={"render desktop"}
/>
<MediaMatcher
    mobile={"render for mobile"}
    tablet={null} // nothing will be rendered for tablet
    desktop={"render desktop"}
/>
<MediaMatches>
    {matches => (
        <span> testing {
            // pick matching values
            pickMatch(matches, {
                mobile: "mobile",
                // tablet: "tablet", // the same rules
                desktop: "desktop",
            })
        }</span>
    )}
</MediaMatches>
```
>PS: Dont forget to wrap all this with ProvideMediaMatchers

## API
 react-media-match provides an API for "default" queries, and a factory method to create custom media queries.

 `createMediaMatcher(breakPoints: { key: string })` - factory for a new API for provided breakpoints

 There is also pre-exported API for default breakpoints - mobile, tablet, desktop

 - `pickMatch(matches, matchers)` - function, return value from matchers matching matches.

 - `ProvideMediaMatchers` - component, calculates media queries and stores them in context.

 - `MediaMatches` - component, returns current matchers as a render prop

 - `MediaMatcher` - component, renders path for active match

## Sandbox

https://codesandbox.io/s/o7q3zlo0n9

# Licence
MIT
