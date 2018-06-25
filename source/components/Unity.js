"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var UnityLoaderService_1 = require("../services/UnityLoaderService");
require("../Types");
var Unity = /** @class */ (function (_super) {
    __extends(Unity, _super);
    /**
     * Initialized the component.
     * @param {IUnityProps} props
     */
    function Unity(props) {
        var _this = _super.call(this, props) || this;
        /**
         * The component state.
         * @type {IUnityState}
         * @public
         */
        _this.state = {};
        _this.unityLoaderService = new UnityLoaderService_1["default"]();
        _this.unityContent = _this.props.unityContent;
        _this.unityContent.setComponentInstance(_this);
        return _this;
    }
    /**
     * An event that is triggered by the Unity player. This tracks
     * the loading progression of the player. It will send '1' when
     * the loading is completed.
     * @param {UnityInstance} unityInstance
     * @param {number} progression
     * @private
     */
    Unity.prototype.onProgress = function (unityInstance, progression) {
        this.unityContent.triggerUnityEvent("progress", progression);
        if (progression === 1)
            this.unityContent.triggerUnityEvent("loaded");
    };
    /**
     * Initialzied the Unity player when the component is mounted.
     * @public
     */
    Unity.prototype.componentDidMount = function () {
        var _this = this;
        // prettier-ignore
        this.unityLoaderService.append(this.props.unityContent.unityLoaderJsPath, function () {
            _this.unityContent.setUnityInstance(UnityLoader.instantiate("__ReactUnityWebGL", _this.props.unityContent.buildJsonPath, {
                onProgress: _this.onProgress.bind(_this),
                Module: _this.props.unityContent.unityConfig.modules
            }));
        });
    };
    /**
     * Renders the unity wrapper and player.
     * @returns {React.ReactNode} element
     * @public
     */
    Unity.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {
            className: this.props.className || "",
            ref: function (ref) { return (_this.htmlElement = ref); },
            id: "__ReactUnityWebGL",
            style: {
                width: this.props.width || "800px",
                height: this.props.height || "600px"
            }
        });
    };
    return Unity;
}(React.Component));
exports["default"] = Unity;
