"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = Button;
var _native = require("@react-navigation/native");
var _color = _interopRequireDefault(require("color"));
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _PlatformPressable = require("./PlatformPressable.js");
var _Text = require("./Text.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BUTTON_RADIUS = 40;
function Button(props) {
  if ('screen' in props || 'action' in props) {
    // @ts-expect-error: This is already type-checked by the prop types
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(ButtonLink, {
      ...props
    });
  } else {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(ButtonBase, {
      ...props
    });
  }
}
function ButtonLink({
  screen,
  params,
  action,
  href,
  ...rest
}) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = (0, _native.useLinkProps)({
    screen,
    params,
    action,
    href
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ButtonBase, {
    ...rest,
    ...props
  });
}
function ButtonBase({
  variant = 'tinted',
  color: customColor,
  android_ripple,
  style,
  children,
  ...rest
}) {
  const {
    colors,
    fonts
  } = (0, _native.useTheme)();
  const color = customColor ?? colors.primary;
  let backgroundColor;
  let textColor;
  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor = (0, _color.default)(color).fade(0.85).string();
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = (0, _color.default)(color).isDark() ? 'white' : (0, _color.default)(color).darken(0.71).string();
      break;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PlatformPressable.PlatformPressable, {
    ...rest,
    android_ripple: {
      radius: BUTTON_RADIUS,
      color: (0, _color.default)(textColor).fade(0.85).string(),
      ...android_ripple
    },
    pressOpacity: _reactNative.Platform.OS === 'ios' ? undefined : 1,
    hoverEffect: {
      color: textColor
    },
    style: [{
      backgroundColor
    }, styles.button, style],
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: [{
        color: textColor
      }, fonts.regular, styles.text],
      children: children
    })
  });
}
const styles = _reactNative.StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center'
  }
});
//# sourceMappingURL=Button.js.map