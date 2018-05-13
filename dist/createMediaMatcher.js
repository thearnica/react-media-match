"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_media_1 = require("react-media");
var react_adopt_1 = require("react-adopt");
var context_1 = require("./context");
var utils_1 = require("./utils");
function createMatcher(mediaRules) {
    return react_adopt_1.adopt(utils_1.forEachName(mediaRules, function (rule) { return React.createElement(react_media_1.default, { query: mediaRules[rule] }); }));
}
;
function createMediaMatcher(breakPoints) {
    var Matches = createMatcher(breakPoints);
    function pickMatch(matches, slots) {
        return utils_1.pickMediaMatch(breakPoints, matches, slots);
    }
    ;
    function pickMatchEx(matches, slots) {
        return utils_1.pickMediaMatch(breakPoints, matches, slots);
    }
    ;
    var ProvideMediaMatchers = function (_a) {
        var children = _a.children;
        return (React.createElement(Matches, null, function (matches) { return React.createElement(context_1.MediaContext.Provider, { value: matches }, children); }));
    };
    var MediaMatches = function (_a) {
        var children = _a.children;
        return (React.createElement(context_1.MediaContext.Consumer, null, function (matched) { return children(matched); }));
    };
    var MediaMatcher = function (props) { return (React.createElement(context_1.MediaContext.Consumer, null, function (matched) { return pickMatchEx(matched, props); })); };
    var InlineMediaMatcher = function (props) { return (React.createElement(Matches, null, function (matched) { return pickMatchEx(matched, props); })); };
    return {
        pickMatch: pickMatch,
        ProvideMediaMatchers: ProvideMediaMatchers,
        MediaMatches: MediaMatches,
        InlineMediaMatcher: InlineMediaMatcher,
        MediaMatcher: MediaMatcher,
        Matches: Matches
    };
}
exports.createMediaMatcher = createMediaMatcher;
