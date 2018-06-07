# react-media-match

[![NPM](https://nodei.co/npm/react-media-match.png?downloads=true&stars=true)](https://nodei.co/npm/react-media-match/)

__Mobile first__ react responsive framework made easy. The main difference from `react-media` - everything.

Define once all your media queries (2-3-4 usual), and them use them _simultaneously_!
Define how application should look like on all resolutions.

Each Media Query is responsible only for a single "dimension" - width, height or orientation.
- If you have defined what Query should render on _mobile_, but not everything else - it will always use mobile.
- defined _mobile_ and _desktop_, but not _tablet_ or _laptop_? It will use "value to the left".

"Pick value to the left" is the core concept. It protects you from mistakes, and allows to skip intermediate resolutions, if they should inherit styled from "lesser" query.

- If you need to respond to screen size and orientation - create 2 separate matchers, and work with them - separately!
- If you need to respond to NOT screen or NOT media - just _provide_ values MediaMatcher should match againts and that's done!

react-media-match was made with maintanability and mobile first approach in mind. It makes things simpler.

react-media-match provides 2 components and one function, and no of them awaits query as a prop,

```js
<ProvideMediaMatchers>
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
</ProvideMediaMatchers>
```
PS: Dont forget to __wrap all this with ProvideMediaMatchers__

## API
 react-media-match provides an API for "default" queries, and a factory method to create custom media queries.

 - `createMediaMatcher(breakPoints: { key: string })` - factory for a new API for provided breakpoints.
 The object with following props will be returned:
   - pickMatch
   - Matches
   - Matcher
   - Provider
   - Mock

 There is also pre-exported API for default breakpoints - mobile, tablet, desktop

 - `pickMatch(matches, matchers)` - function, return value from matchers matching matches.

 - `ProvideMediaMatchers` - component, calculates media queries and stores them in context.

 - `MediaMatches` - component, returns current matchers as a render prop

 - `MediaMatcher` - component, renders path for active match

# Example
 - Define secondary Query for orientation
```js
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


## Sandbox

https://codesandbox.io/s/o7q3zlo0n9

# Testing and Mocking
 - `ProvideMediaMatchers` has a `state` paramiter, and you might specify it override any information, and control all the nested matchers.
 - `MediaMock` will completely mock media settings.

 Both mocks are not working for `Inline` component


# Articles

https://spectrum.chat/thread/2057cb44-ddd7-4fb2-98f8-c1d697bcf62d

# Testing and Mocking
 Just provide `state` for ProvideMediaMatchers, and it will control all the nested matchers. Could be used to provide __not media-based__ rules.

# Licence
MIT
