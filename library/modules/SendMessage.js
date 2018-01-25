'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SendMessage = SendMessage;

var _Unity = require('../components/Unity');

function SendMessage(gameObjectName, methodName, paramterValue) {
    console.warn('SendMessage is deprecated since version 6.4.0, use UnityEvent instead.');
    if (typeof _Unity.UnityInstance !== 'undefined') _Unity.UnityInstance.SendMessage(gameObjectName, methodName, paramterValue || '');else console.warn('Wait for Unity to be instantiated before sending a message to \'' + gameObjectName + '\'');
}