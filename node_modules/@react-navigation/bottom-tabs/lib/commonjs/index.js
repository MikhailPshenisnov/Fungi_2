"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BottomTabBar", {
  enumerable: true,
  get: function () {
    return _BottomTabBar.BottomTabBar;
  }
});
Object.defineProperty(exports, "BottomTabBarHeightCallbackContext", {
  enumerable: true,
  get: function () {
    return _BottomTabBarHeightCallbackContext.BottomTabBarHeightCallbackContext;
  }
});
Object.defineProperty(exports, "BottomTabBarHeightContext", {
  enumerable: true,
  get: function () {
    return _BottomTabBarHeightContext.BottomTabBarHeightContext;
  }
});
Object.defineProperty(exports, "BottomTabView", {
  enumerable: true,
  get: function () {
    return _BottomTabView.BottomTabView;
  }
});
exports.TransitionSpecs = exports.TransitionPresets = exports.SceneStyleInterpolators = void 0;
Object.defineProperty(exports, "createBottomTabNavigator", {
  enumerable: true,
  get: function () {
    return _createBottomTabNavigator.createBottomTabNavigator;
  }
});
Object.defineProperty(exports, "useBottomTabBarHeight", {
  enumerable: true,
  get: function () {
    return _useBottomTabBarHeight.useBottomTabBarHeight;
  }
});
var SceneStyleInterpolators = _interopRequireWildcard(require("./TransitionConfigs/SceneStyleInterpolators.js"));
exports.SceneStyleInterpolators = SceneStyleInterpolators;
var TransitionPresets = _interopRequireWildcard(require("./TransitionConfigs/TransitionPresets.js"));
exports.TransitionPresets = TransitionPresets;
var TransitionSpecs = _interopRequireWildcard(require("./TransitionConfigs/TransitionSpecs.js"));
exports.TransitionSpecs = TransitionSpecs;
var _createBottomTabNavigator = require("./navigators/createBottomTabNavigator.js");
var _BottomTabBar = require("./views/BottomTabBar.js");
var _BottomTabView = require("./views/BottomTabView.js");
var _BottomTabBarHeightCallbackContext = require("./utils/BottomTabBarHeightCallbackContext.js");
var _BottomTabBarHeightContext = require("./utils/BottomTabBarHeightContext.js");
var _useBottomTabBarHeight = require("./utils/useBottomTabBarHeight.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//# sourceMappingURL=index.js.map