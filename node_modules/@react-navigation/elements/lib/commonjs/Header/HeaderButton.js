"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderButton = HeaderButton;
var _reactNative = require("react-native");
var _PlatformPressable = require("../PlatformPressable.js");
var _jsxRuntime = require("react/jsx-runtime");
function HeaderButton({
  disabled,
  onPress,
  pressColor,
  pressOpacity,
  accessibilityLabel,
  testID,
  style,
  href,
  children
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PlatformPressable.PlatformPressable, {
    disabled: disabled,
    href: href,
    accessibilityLabel: accessibilityLabel,
    testID: testID,
    onPress: onPress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    android_ripple: androidRipple,
    style: [styles.container, disabled && styles.disabled, style],
    hitSlop: _reactNative.Platform.select({
      ios: undefined,
      default: {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16
      }
    }),
    children: children
  });
}
const androidRipple = {
  borderless: true,
  foreground: _reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= 23,
  radius: 20
};
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    // Roundness for iPad hover effect
    borderRadius: 10
  },
  disabled: {
    opacity: 0.5
  }
});
//# sourceMappingURL=HeaderButton.js.map