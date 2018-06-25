"use strict";
exports.__esModule = true;
var UnityLoaderService = /** @class */ (function () {
    function UnityLoaderService() {
        /**
         * Reference to the document head.
         * @type {HTMLHeadElement}
         * @private
         */
        this.documentHead = document.getElementsByTagName("head")[0];
    }
    /**
     * Appends the Unity loader script to the window. When it's loaded a callback will
     * be triggered. NOTE: This can't be a promisse due to JavaScript compatibilty.
     * @param {string} source the path to the Unity loader file
     * @param {Function} onLoad when the script is loaded
     * @public
     */
    UnityLoaderService.prototype.append = function (source, onLoad) {
        this.unityLoaderScript = document.createElement("script");
        this.unityLoaderScript.type = "text/javascript";
        this.unityLoaderScript.async = true;
        this.unityLoaderScript.src = source;
        this.unityLoaderScript.onload = function () {
            onLoad();
        };
        this.documentHead.appendChild(this.unityLoaderScript);
    };
    return UnityLoaderService;
}());
exports["default"] = UnityLoaderService;
