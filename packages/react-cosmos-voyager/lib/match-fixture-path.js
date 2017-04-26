"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var buildPathMatchers = function buildPathMatchers(componentName) {
  return ["/__fixtures__/" + componentName + "/([^/]+)\\.(js|json)$", "/" + componentName + "/(?:.+/)?__fixtures__/([^/]+)\\.(js|json)$", "/" + componentName + "/([^/]+)\\.(js|json)$"];
};

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
var matchFixturePath = function matchFixturePath(fixturePath, componentName) {
  var matchers = buildPathMatchers(componentName);

  for (var i = 0; i < matchers.length; i += 1) {
    var matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  return false;
};

exports.default = matchFixturePath;