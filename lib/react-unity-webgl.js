"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Message = exports.Unity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function Message(gameObjectName, methodName, paramterValue) {
    if (paramterValue == null) {
        paramterValue = "";
    }
    if (module.exports.UnityInstance != null) {
        module.exports.UnityInstance.SendMessage(gameObjectName, methodName, paramterValue);
    }
};

var Unity = function (_Component) {
    _inherits(Unity, _Component);

    function Unity(props) {
        _classCallCheck(this, Unity);

        var _this = _possibleConstructorReturn(this, (Unity.__proto__ || Object.getPrototypeOf(Unity)).call(this, props));

        _this.state = {
            progress: 0,
            loaded: false,
            error: null
        };
        return _this;
    }

    _createClass(Unity, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.instantiateUnityLoader();
        }
    }, {
        key: "instantiateUnityLoader",
        value: function instantiateUnityLoader() {
            var _this2 = this;

            if (this.props.src == null) {
                this.setState({
                    error: "Please provice a path to a valid JSON in the 'src' attribute."
                });
                return;
            }
            var instance = UnityLoader.instantiate("unity-container", this.props.src, {
                onProgress: function onProgress(gameInstance, progress) {
                    _this2.setState({
                        loaded: progress == 1,
                        progress: progress
                    });
                }
            });
            module.exports.UnityInstance = instance;
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.error == null) {
                return this.onLoadedRender();
            } else {
                return this.onUnableToRender();
            }
        }
    }, {
        key: "onUnableToRender",
        value: function onUnableToRender() {
            return _react2.default.createElement(
                "div",
                { className: "unity-container" },
                _react2.default.createElement(
                    "b",
                    null,
                    "React-Unity-Webgl error"
                ),
                ":",
                this.state.error
            );
        }
    }, {
        key: "onLoadedRender",
        value: function onLoadedRender() {
            return _react2.default.createElement(
                "div",
                { style: this.style },
                _react2.default.createElement("div", { className: "unity-container", id: "unity-container" }),
                this.state.loaded == false && _react2.default.createElement(
                    "div",
                    { className: "unity-loader" },
                    _react2.default.createElement(
                        "div",
                        { className: "bar" },
                        _react2.default.createElement("div", { className: "fill", style: { width: this.state.progress * 100 + "%" } })
                    )
                )
            );
        }
    }]);

    return Unity;
}(_react.Component);

exports.Unity = Unity;
exports.Message = Message;