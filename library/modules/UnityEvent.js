'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UnityEvent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Unity = require('../components/Unity');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnityEvent = exports.UnityEvent = function () {
    function UnityEvent(gameObjectName, methodName) {
        _classCallCheck(this, UnityEvent);

        this.gameObjectName = gameObjectName;
        this.methodName = methodName;
    }

    _createClass(UnityEvent, [{
        key: 'emit',
        value: function emit(parameter) {
            if (this.canEmit() === true) _Unity.UnityInstance.SendMessage(this.gameObjectName, this.methodName, parameter || '');else console.warn('Wait for Unity to be instantiated before sending an event \'' + this.methodName + '\'');
        }
    }, {
        key: 'canEmit',
        value: function canEmit() {
            return typeof _Unity.UnityInstance !== 'undefined';
        }
    }]);

    return UnityEvent;
}();