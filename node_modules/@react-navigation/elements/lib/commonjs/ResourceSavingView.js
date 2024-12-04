"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceSavingView = ResourceSavingView;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

function ResourceSavingView({
  visible,
  children,
  style,
  ...rest
}) {
  if (_reactNative.Platform.OS === 'web') {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View
    // @ts-expect-error: hidden exists on web, but not in React Native
    , {
      hidden: !visible,
      style: [{
        display: visible ? 'flex' : 'none'
      }, styles.container, style],
      pointerEvents: visible ? 'auto' : 'none',
      ...rest,
      children: children
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [styles.container, style]
    // box-none doesn't seem to work properly on Android
    ,
    pointerEvents: visible ? 'auto' : 'none',
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      collapsable: false,
      removeClippedSubviews:
      // On iOS & macOS, set removeClippedSubviews to true only when not focused
      // This is an workaround for a bug where the clipped view never re-appears
      _reactNative.Platform.OS === 'ios' || _reactNative.Platform.OS === 'macos' ? !visible : true,
      pointerEvents: visible ? 'auto' : 'none',
      style: visible ? styles.attached : styles.detached,
      children: children
    })
  });
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  attached: {
    flex: 1
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY
  }
});
//# sourceMappingURL=ResourceSavingView.js.map