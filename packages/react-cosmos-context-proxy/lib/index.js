'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createContextProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaults = {
  fixtureKey: 'context'
};

function createContextProxy(options) {
  var _defaults$options = _extends({}, defaults, options),
      fixtureKey = _defaults$options.fixtureKey,
      childContextTypes = _defaults$options.childContextTypes;

  var ContextProxy = function (_React$Component) {
    _inherits(ContextProxy, _React$Component);

    function ContextProxy() {
      _classCallCheck(this, ContextProxy);

      return _possibleConstructorReturn(this, (ContextProxy.__proto__ || Object.getPrototypeOf(ContextProxy)).apply(this, arguments));
    }

    _createClass(ContextProxy, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return this.props.fixture[fixtureKey];
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            nextProxy = _props.nextProxy,
            fixture = _props.fixture,
            onComponentRef = _props.onComponentRef;


        return _react2.default.createElement(nextProxy.value, _extends({}, this.props, {
          nextProxy: nextProxy.next(),
          fixture: fixture,
          onComponentRef: onComponentRef
        }));
      }
    }]);

    return ContextProxy;
  }(_react2.default.Component);

  ContextProxy.propTypes = {
    nextProxy: _react2.default.PropTypes.shape({
      value: _react2.default.PropTypes.func,
      next: _react2.default.PropTypes.func
    }).isRequired,
    component: _react2.default.PropTypes.func.isRequired,
    fixture: _react2.default.PropTypes.object.isRequired,
    onComponentRef: _react2.default.PropTypes.func.isRequired,
    onFixtureUpdate: _react2.default.PropTypes.func.isRequired
  };

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}