"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Badge = Badge;
var _native = require("@react-navigation/native");
var _color = _interopRequireDefault(require("color"));
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const useNativeDriver = _reactNative.Platform.OS !== 'web';
function Badge({
  children,
  style,
  visible = true,
  size = 18,
  ...rest
}) {
  const [opacity] = React.useState(() => new _reactNative.Animated.Value(visible ? 1 : 0));
  const [rendered, setRendered] = React.useState(visible);
  const {
    colors,
    fonts
  } = (0, _native.useTheme)();
  React.useEffect(() => {
    if (!rendered) {
      return;
    }
    _reactNative.Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished && !visible) {
        setRendered(false);
      }
    });
    return () => opacity.stopAnimation();
  }, [opacity, rendered, visible]);
  if (!rendered) {
    if (visible) {
      setRendered(true);
    } else {
      return null;
    }
  }

  // @ts-expect-error: backgroundColor definitely exists
  const {
    backgroundColor = colors.notification,
    ...restStyle
  } = _reactNative.StyleSheet.flatten(style) || {};
  const textColor = (0, _color.default)(backgroundColor).isLight() ? 'black' : 'white';
  const borderRadius = size / 2;
  const fontSize = Math.floor(size * 3 / 4);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.Text, {
    numberOfLines: 1,
    style: [{
      transform: [{
        scale: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1]
        })
      }],
      color: textColor,
      lineHeight: size - 1,
      height: size,
      minWidth: size,
      opacity,
      backgroundColor,
      fontSize,
      borderRadius
    }, fonts.regular, styles.container, restStyle],
    ...rest,
    children: children
  });
}
const styles = _reactNative.StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=Badge.js.map