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
        return _super.call(this, props) || this;
    }
    Unity.prototype.render = function () {
        return React.createElement("div", null, "Fullscreen? " + this.props.content.unityConfig.isFullscreen);
    };
    return Unity;
}(React.Component));
exports["default"] = Unity;
//# sourceMappingURL=Unity.js.map