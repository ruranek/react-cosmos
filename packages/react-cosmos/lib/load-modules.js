'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.loadComponents = loadComponents;
exports.loadFixtures = loadFixtures;

var _importModule = require('react-cosmos-utils/lib/import-module');

var _importModule2 = _interopRequireDefault(_importModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Improve ReactComponent check!
var isReactComponent = function isReactComponent(component) {
  return typeof component === 'string' || typeof component === 'function' || (typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object';
};

/**
 * Input example:
 * {
 *   'Comment': { __esModule: true, default: [ReactComponent] },
 * }
 * Output example:
 * {
 *   'Comment': [ReactComponent],
 * }
 */
function loadComponents(components) {
  var result = {};

  Object.keys(components).forEach(function (name) {
    var component = (0, _importModule2.default)(components[name], name);

    if (!component || !isReactComponent(component)) {
      console.warn('\'' + name + '\' is not a valid React component');
    } else {
      result[name] = component.default ? component.default : component;
    }
  });

  return result;
}

/**
 * Input example:
 * {
 *   'Comment': {
 *     'short': { __esModule: true, default: { ... } },
 *   },
 *   'Post': {}
 * }
 * Output example:
 * {
 *   'Comment': {
 *     'short': {
 *       'author': 'Sarcastic Sue'
 *       'body': ':)'
 *     },
 *   },
 *   'Post': {
 *     'no props (auto)': {}
 *   }
 * }
 */
function loadFixtures(fixtures) {
  var result = {};

  Object.keys(fixtures).forEach(function (componentName) {
    var componentFixtures = fixtures[componentName];
    var componentResult = {};

    Object.keys(componentFixtures).forEach(function (name) {
      componentResult[name] = (0, _importModule2.default)(componentFixtures[name], name);
    });

    // Allow users to browse components before creating fixtures
    // TODO: Create more than empty defaults. Alongside a more metadata-rich
    // input, we could generate default fixtures to match PropTypes.
    if (Object.keys(componentResult).length === 0) {
      componentResult['no props (auto)'] = {};
    }

    result[componentName] = componentResult;
  });

  return result;
}