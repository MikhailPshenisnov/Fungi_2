"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultHeaderHeight = getDefaultHeaderHeight;
var _reactNative = require("react-native");
function getDefaultHeaderHeight(layout, modalPresentation, topInset) {
  let headerHeight;

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = _reactNative.Platform.OS === 'ios' && topInset > 50;
  const statusBarHeight = hasDynamicIsland ? topInset - (5 + 1 / _reactNative.PixelRatio.get()) : topInset;
  const isLandscape = layout.width > layout.height;
  if (_reactNative.Platform.OS === 'ios') {
    if (_reactNative.Platform.isPad || _reactNative.Platform.isTV) {
      if (modalPresentation) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (modalPresentation) {
          headerHeight = 56;
        } else {
          headerHeight = 44;
        }
      }
    }
  } else {
    headerHeight = 64;
  }
  return headerHeight + statusBarHeight;
}
//# sourceMappingURL=getDefaultHeaderHeight.js.map