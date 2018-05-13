import * as React from 'react';
import {Component} from 'react';
import {ProvideMediaMatchers, MediaMatcher, InlineMediaMatcher, pickMatch, MediaMatches} from "../src";

export interface AppState {

}


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
                </div>
                <div>
                    displaying all 2:
                    <MediaMatcher
                        mobile={"mobile"}
                        // tablet={"tablet"}
                        desktop={"desktop"}
                    />
                    <InlineMediaMatcher
                        mobile={"mobile"}
                        // tablet={"tablet"}
                        desktop={"desktop"}
                    />
                    <MediaMatches>
                        {matches => (
                            <span> testing {pickMatch(matches, {
                                mobile: "mobile",
                                // tablet: "tablet",
                                desktop: "desktop",
                            })}</span>
                        )}
                    </MediaMatches>
                </div>

                <div>
                    displaying all 2 + null:
                    <MediaMatcher
                        mobile={"mobile"}
                         tablet={null}
                        desktop={"desktop"}
                    />
                    <InlineMediaMatcher
                        mobile={"mobile"}
                        tablet={null}
                        desktop={"desktop"}
                    />
                    <MediaMatches>
                        {matches => (
                            <span> testing {pickMatch(matches, {
                                mobile: "mobile",
                                tablet: null,
                                desktop: "desktop",
                            })}</span>
                        )}
                    </MediaMatches>
                </div>
            </ProvideMediaMatchers>
        )
    }
}