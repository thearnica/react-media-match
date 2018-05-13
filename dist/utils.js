"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function forEachName(object, map) {
    return Object
        .keys(object)
        .map(function (key) { return ({ key: key, value: map(key) }); })
        .reduce(function (acc, line) {
        return (__assign({}, acc, (_a = {}, _a[line.key] = line.value, _a)));
        var _a;
    }, {});
}
exports.forEachName = forEachName;
function pickMediaMatch(mediaRules, matches, slots) {
    var keys = Object.keys(mediaRules);
    var len = keys.length;
    var index = 0;
    for (; index < len; index++) {
        if (matches[keys[index]]) {
            break;
        }
    }
    for (; index >= 0; index--) {
        var value = slots[keys[index]];
        if (value || value === null) {
            return value;
        }
    }
    return null;
}
exports.pickMediaMatch = pickMediaMatch;
