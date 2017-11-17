'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnityLoaderServer = function () {
    function UnityLoaderServer() {
        _classCallCheck(this, UnityLoaderServer);
    }

    _createClass(UnityLoaderServer, [{
        key: 'append',
        value: function append(src) {
            return new Promise(function (resolve, reject) {
                var unityLoaderScript = document.createElement('script');
                unityLoaderScript.type = 'text/javascript';
                unityLoaderScript.async = true;
                unityLoaderScript.src = src;
                unityLoaderScript.onload = function () {
                    resolve();
                };
                document.getElementsByTagName('head')[0].appendChild(unityLoaderScript);
            });
        }
    }]);

    return UnityLoaderServer;
}();

exports.default = UnityLoaderServer;