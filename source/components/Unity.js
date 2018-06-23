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
var Unity = /** @class */ (function (_super) {
    __extends(Unity, _super);
    function Unity(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.unityContent = _this.props.unityContent;
        _this.unityContent.setComponentInstance(_this);
        return _this;
        // this.unityContent.setUnityInstance(this); // TODO
    }
    Unity.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {
            className: this.props.className || "",
            ref: function (ref) { return (_this.htmlElement = ref); },
            style: {
                width: this.props.width || "800px",
                height: this.props.height || "600px"
            }
        }, "Fullscreen!");
    };
    return Unity;
}(React.Component));
exports["default"] = Unity;
//# sourceMappingURL=Unity.js.map