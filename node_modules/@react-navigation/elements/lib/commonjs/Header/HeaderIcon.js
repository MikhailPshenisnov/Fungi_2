"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderIcon = HeaderIcon;
exports.ICON_SIZE = exports.ICON_MARGIN = void 0;
var _native = require("@react-navigation/native");
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function HeaderIcon({
  source,
  style,
  ...rest
}) {
  const {
    colors
  } = (0, _native.useTheme)();
  const {
    direction
  } = (0, _native.useLocale)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
    source: source,
    resizeMode: "contain",
    fadeDuration: 0,
    tintColor: colors.text,
    style: [styles.icon, direction === 'rtl' && styles.flip, style],
    ...rest
  });
}
const ICON_SIZE = exports.ICON_SIZE = _reactNative.Platform.OS === 'ios' ? 21 : 24;
const ICON_MARGIN = exports.ICON_MARGIN = _reactNative.Platform.OS === 'ios' ? 8 : 3;
const styles = _reactNative.StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: ICON_MARGIN
  },
  flip: {
    transform: 'scaleX(-1)'
  }
});
//# sourceMappingURL=HeaderIcon.js.map