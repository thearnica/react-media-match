import * as React from 'react';
import {Component} from 'react';
import {
    ProvideMediaMatchers,
    MediaMatcher,
    InlineMediaMatcher,
    pickMatch,
    MediaMatches,
    MediaMock,
    createMediaMatcher
} from "../src";

export interface AppState {

}

const SecodaryMedia = createMediaMatcher({
    'mobile': '(max-width: 600px)',
    'tablet': '(max-width: 900px)',
    'desktop': '(min-width: 700px)',
})

export default class App extends Component <{}, AppState> {
    state: AppState = {}

    render() {
        return (
            <ProvideMediaMatchers>
                <div>
                    displaying all 3:
                    <MediaMatcher
                        mobile={"mobile"}
                        tablet={"tablet"}
                        desktop={"desktop"}
                    />
                    <InlineMediaMatcher
                        mobile={"mobile"}
                        tablet={"tablet"}
                        desktop={"desktop"}
                    />
                    <MediaMatches>
                        {matches => (
                            <span> testing {pickMatch(matches, {
                                mobile: "mobile",
                                tablet: "tablet",
                                desktop: "desktop",
                            })}</span>
                        )}
                    </MediaMatches>
                    <br/>
                    <MediaMock tablet={true}>
                        always tablet:
                        <MediaMatcher
                            mobile={"mobile"}
                            tablet={"tablet"}
                            desktop={"desktop"}
                        />
                    </MediaMock>

                </div>
                <div>
                <SecodaryMedia.Provider>
                    <SecodaryMedia.Matcher
                       mobile="m-NEVER VISIBLE"
                       tablet={ <MediaMatcher mobile="m" tablet="t" desktop="d" />}
                       desktop="d-NEVER VISIBLE"
                    />
                </SecodaryMedia.Provider>
                </div>
            </ProvideMediaMatchers>
        )
    }
}