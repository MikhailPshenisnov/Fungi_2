"use strict";

import { Platform, StyleSheet } from 'react-native';
import { PlatformPressable } from "../PlatformPressable.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function HeaderButton({
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
  return /*#__PURE__*/_jsx(PlatformPressable, {
    disabled: disabled,
    href: href,
    accessibilityLabel: accessibilityLabel,
    testID: testID,
    onPress: onPress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    android_ripple: androidRipple,
    style: [styles.container, disabled && styles.disabled, style],
    hitSlop: Platform.select({
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
  foreground: Platform.OS === 'android' && Platform.Version >= 23,
  radius: 20
};
const styles = StyleSheet.create({
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