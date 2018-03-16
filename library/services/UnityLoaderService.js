"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnityLoaderService = function () {
  function UnityLoaderService() {
    _classCallCheck(this, UnityLoaderService);

    this.documentHead = document.getElementsByTagName("head")[0];
    this.unityLoaderScript = null;
  }

  _createClass(UnityLoaderService, [{
    key: "append",
    value: function append(src) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.unityLoaderScript = document.createElement("script");
        _this.unityLoaderScript.type = "text/javascript";
        _this.unityLoaderScript.async = true;
        _this.unityLoaderScript.src = src;
        _this.unityLoaderScript.onload = function () {
          resolve();
        };
        _this.documentHead.appendChild(_this.unityLoaderScript);
      });
    }
  }, {
    key: "unmount",
    value: function unmount() {
      /// unmounting is disabled due to bug
      /// https://github.com/jeffreylanters/react-unity-webgl/issues/22
      // if (this.unityLoaderScript !== null) {
      //     this.documentHead.removeChild(this.unityLoaderScript)
      // }
    }
  }]);

  return UnityLoaderService;
}();

exports.default = UnityLoaderService;