"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShiftSpec = exports.FadeSpec = void 0;
var _reactNative = require("react-native");
const FadeSpec = exports.FadeSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: _reactNative.Easing.in(_reactNative.Easing.linear)
  }
};
const ShiftSpec = exports.ShiftSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: _reactNative.Easing.inOut(_reactNative.Easing.ease)
  }
};
//# sourceMappingURL=TransitionSpecs.js.map