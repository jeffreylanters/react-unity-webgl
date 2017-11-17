'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SendMessage = SendMessage;

var _Unity = require('./Unity');

/**
 * Sends a message to the Unity content. This works the same
 * as Unity's internal 'SendMessage' system. The paramaterValue
 * is an optional field.
 * @param {string} gameObjectName 
 * @param {string} methodName 
 * @param {object} paramterValue 
 */
function SendMessage(gameObjectName, methodName, paramterValue) {
    if (typeof paramterValue === 'undefined') paramterValue = '';

    if (typeof _Unity.UnityInstance !== 'undefined') _Unity.UnityInstance.SendMessage(gameObjectName, methodName, paramterValue);else console.warn('Wait for Unity to be instantiated before sending a message to \'' + gameObjectName + '\'');
}