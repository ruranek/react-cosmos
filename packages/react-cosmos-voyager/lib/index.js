'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _matchFixturePath = require('./match-fixture-path');

var _matchFixturePath2 = _interopRequireDefault(_matchFixturePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SPECIAL_DIRS = ['__tests__', '__fixtures__'];

var isUnderSpecialDir = function isUnderSpecialDir(filePath) {
  return SPECIAL_DIRS.some(function (dir) {
    return filePath.indexOf('/' + dir + '/') !== -1;
  });
};

var getExternalFixtures = function getExternalFixtures(fixturePaths) {
  return fixturePaths.reduce(function (prev, next) {
    return [].concat(_toConsumableArray(prev), _toConsumableArray(_glob2.default.sync(next + '/**/*.{js,json}')));
  }, []);
};

var extractComponentName = function extractComponentName(filePath, rootPath) {
  var componentName = filePath.slice(rootPath.length + 1).replace(/\.jsx?$/, '');

  // Nested components are normalized. E.g. Header/Header.jsx will only
  // show up as "Header" in the UI and will read fixtures from
  // Header/__fixtures__ or from a custom fixture path.
  var parts = componentName.split('/');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === parts[parts.length - 2]) {
      componentName = parts.slice(0, -1).join('/');
    }
  }

  return componentName;
};

var getMatchingFixtures = function getMatchingFixtures(fixtures, componentName) {
  return fixtures.reduce(function (matchingFixtures, fixturePath) {
    var fixtureName = (0, _matchFixturePath2.default)(fixturePath, componentName);
    return fixtureName ? _extends({}, matchingFixtures, _defineProperty({}, fixtureName, fixturePath)) : matchingFixtures;
  }, {});
};

var getFilePaths = function getFilePaths(_ref) {
  var _ref$componentPaths = _ref.componentPaths,
      componentPaths = _ref$componentPaths === undefined ? [] : _ref$componentPaths,
      _ref$fixturePaths = _ref.fixturePaths,
      fixturePaths = _ref$fixturePaths === undefined ? [] : _ref$fixturePaths,
      _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === undefined ? [] : _ref$ignore,
      getComponentName = _ref.getComponentName,
      getFixturePathsForComponent = _ref.getFixturePathsForComponent;

  var extFixtures = getExternalFixtures(fixturePaths);
  var components = {};
  var fixtures = {};

  componentPaths.forEach(function (componentPath) {
    if (_fs2.default.lstatSync(componentPath).isFile()) {
      if (typeof getComponentName !== 'function') {
        throw new TypeError('Must implement getComponentName when using exact file paths in componentPaths');
      }

      var componentDir = _path2.default.dirname(componentPath);
      var componentName = getComponentName(componentPath);

      components[componentName] = componentPath;
      fixtures[componentName] = typeof getFixturePathsForComponent === 'function' ? getFixturePathsForComponent(componentName) : getMatchingFixtures([].concat(_toConsumableArray(_glob2.default.sync(componentDir + '/**/__fixtures__/**/*.{js,json}')), _toConsumableArray(extFixtures)), componentName);
    } else {
      var relFixtures = _glob2.default.sync(componentPath + '/**/__fixtures__/**/*.{js,json}');
      _glob2.default.sync(componentPath + '/**/*.{js,jsx}').forEach(function (filePath) {
        if (isUnderSpecialDir(filePath) || ignore.some(function (ignorePattern) {
          return filePath.match(ignorePattern);
        })) {
          return;
        }

        var componentName = extractComponentName(filePath, componentPath);

        components[componentName] = filePath;
        fixtures[componentName] = getMatchingFixtures([].concat(_toConsumableArray(relFixtures), _toConsumableArray(extFixtures)), componentName);
      });
    }
  });

  return {
    components: components,
    fixtures: fixtures
  };
};

exports.default = getFilePaths;