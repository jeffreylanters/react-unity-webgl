"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RegisterExternalListener = RegisterExternalListener;
/**
 * Registers a listener to this window. When a message is sent
 * from Unity using 'CallExternal', the listener will forward it
 * into your React Application.
 * @param {string} functionName 
 * @param {function} callback 
 */
function RegisterExternalListener(functionName, callback) {
    window[functionName] = function (paramterValue) {
        callback(paramterValue);
    };
}