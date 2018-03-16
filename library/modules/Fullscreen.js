"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetFullscreen = SetFullscreen;

var _Unity = require("../components/Unity");

function SetFullscreen(isFullscreen) {
  if (typeof _Unity.UnityInstance !== "undefined") {
    _Unity.UnityInstance.SetFullscreen(isFullscreen === true ? 1 : 0);
  } else {
    console.warn("Wait for Unity to be instantiated before setting fullscreen.");
  }
}