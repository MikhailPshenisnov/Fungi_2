"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderTitle = HeaderTitle;
var _native = require("@react-navigation/native");
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function HeaderTitle({
  tintColor,
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = (0, _native.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.Text, {
    accessibilityRole: "header",
    "aria-level": "1",
    numberOfLines: 1,
    ...rest,
    style: [{
      color: tintColor === undefined ? colors.text : tintColor
    }, _reactNative.Platform.select({
      ios: fonts.bold,
      default: fonts.medium
    }), styles.title, style]
  });
}
const styles = _reactNative.StyleSheet.create({
  title: _reactNative.Platform.select({
    ios: {
      fontSize: 17
    },
    android: {
      fontSize: 20
    },
    default: {
      fontSize: 18
    }
  })
});
//# sourceMappingURL=HeaderTitle.js.map