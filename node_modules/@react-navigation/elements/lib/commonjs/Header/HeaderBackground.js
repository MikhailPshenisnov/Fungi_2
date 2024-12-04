"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderBackground = HeaderBackground;
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function HeaderBackground({
  style,
  ...rest
}) {
  const {
    colors,
    dark
  } = (0, _native.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.View, {
    style: [styles.container, {
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      ...(_reactNative.Platform.OS === 'ios' && {
        shadowColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 1)'
      })
    }, style],
    ...rest
  });
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    ..._reactNative.Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: _reactNative.StyleSheet.hairlineWidth
        }
      },
      default: {
        borderBottomWidth: _reactNative.StyleSheet.hairlineWidth
      }
    })
  }
});
//# sourceMappingURL=HeaderBackground.js.map