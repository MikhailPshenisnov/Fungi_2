"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlatformPressable = PlatformPressable;
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const AnimatedPressable = _reactNative.Animated.createAnimatedComponent(_reactNative.Pressable);
const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = _reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= ANDROID_VERSION_LOLLIPOP;
const useNativeDriver = _reactNative.Platform.OS !== 'web';

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
function PlatformPressable({
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  android_ripple,
  pressColor,
  pressOpacity = 0.3,
  hoverEffect,
  style,
  children,
  ...rest
}) {
  const {
    dark
  } = (0, _native.useTheme)();
  const [opacity] = React.useState(() => new _reactNative.Animated.Value(1));
  const animateTo = (toValue, duration) => {
    if (ANDROID_SUPPORTS_RIPPLE) {
      return;
    }
    _reactNative.Animated.timing(opacity, {
      toValue,
      duration,
      easing: _reactNative.Easing.inOut(_reactNative.Easing.quad),
      useNativeDriver
    }).start();
  };
  const handlePress = e => {
    if (_reactNative.Platform.OS === 'web' && rest.href != null) {
      // @ts-expect-error: these properties exist on web, but not in React Native
      const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey; // ignore clicks with modifier keys
      // @ts-expect-error: these properties exist on web, but not in React Native
      const isLeftClick = e.button == null || e.button === 0; // only handle left clicks
      const isSelfTarget = [undefined, null, '', 'self'].includes(
      // @ts-expect-error: these properties exist on web, but not in React Native
      e.currentTarget?.target); // let browser handle "target=_blank" etc.
      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault();
        onPress?.(e);
      }
    } else {
      onPress?.(e);
    }
  };
  const handlePressIn = e => {
    animateTo(pressOpacity, 0);
    onPressIn?.(e);
  };
  const handlePressOut = e => {
    animateTo(1, 200);
    onPressOut?.(e);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(AnimatedPressable, {
    accessible: true,
    accessibilityRole: _reactNative.Platform.OS === 'web' && rest.href != null ? 'link' : 'button',
    onPress: disabled ? undefined : handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    android_ripple: ANDROID_SUPPORTS_RIPPLE ? {
      color: pressColor !== undefined ? pressColor : dark ? 'rgba(255, 255, 255, .32)' : 'rgba(0, 0, 0, .32)',
      ...android_ripple
    } : undefined,
    style: [{
      cursor: _reactNative.Platform.OS === 'web' || _reactNative.Platform.OS === 'ios' ?
      // Pointer cursor on web
      // Hover effect on iPad and visionOS
      'pointer' : 'auto',
      opacity: !ANDROID_SUPPORTS_RIPPLE ? opacity : 1
    }, style],
    ...rest,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(HoverEffect, {
      ...hoverEffect
    }), children]
  });
}
const css = String.raw;
const CLASS_NAME = `__react-navigation_elements_Pressable_hover`;
const CSS_TEXT = css`
  .${CLASS_NAME} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background-color: var(--overlay-color);
    opacity: 0;
    transition: opacity 0.15s;
  }

  a:hover > .${CLASS_NAME}, button:hover > .${CLASS_NAME} {
    opacity: var(--overlay-hover-opacity);
  }

  a:active > .${CLASS_NAME}, button:active > .${CLASS_NAME} {
    opacity: var(--overlay-active-opacity);
  }
`;
const HoverEffect = ({
  color,
  hoverOpacity = 0.08,
  activeOpacity = 0.16
}) => {
  if (_reactNative.Platform.OS !== 'web' || color == null) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("style", {
      // @ts-expect-error: href and precedence are only available on React 19
      href: CLASS_NAME,
      precedence: "elements",
      children: CSS_TEXT
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: CLASS_NAME,
      style: {
        // @ts-expect-error: CSS variables are not typed
        '--overlay-color': color,
        '--overlay-hover-opacity': hoverOpacity,
        '--overlay-active-opacity': activeOpacity
      }
    })]
  });
};
//# sourceMappingURL=PlatformPressable.js.map