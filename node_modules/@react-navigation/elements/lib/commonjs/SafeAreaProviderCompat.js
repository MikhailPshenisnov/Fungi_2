"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SafeAreaProviderCompat = SafeAreaProviderCompat;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const {
  width = 0,
  height = 0
} = _reactNative.Dimensions.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = _reactNative.Platform.OS === 'web' || _reactNativeSafeAreaContext.initialWindowMetrics == null ? {
  frame: {
    x: 0,
    y: 0,
    width,
    height
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
} : _reactNativeSafeAreaContext.initialWindowMetrics;
function SafeAreaProviderCompat({
  children,
  style
}) {
  const insets = React.useContext(_reactNativeSafeAreaContext.SafeAreaInsetsContext);
  if (insets) {
    // If we already have insets, don't wrap the stack in another safe area provider
    // This avoids an issue with updates at the cost of potentially incorrect values
    // https://github.com/react-navigation/react-navigation/issues/174
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [styles.container, style],
      children: children
    });
  }
  if (_reactNative.Platform.OS === 'web') {
    children = /*#__PURE__*/(0, _jsxRuntime.jsx)(SafeAreaFrameProvider, {
      initialMetrics: initialMetrics,
      children: children
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeSafeAreaContext.SafeAreaProvider, {
    initialMetrics: initialMetrics,
    style: style,
    children: children
  });
}

// FIXME: On the Web, the safe area frame value doesn't update on resize
// So we workaround this by measuring the frame on resize
const SafeAreaFrameProvider = ({
  initialMetrics,
  children
}) => {
  const element = React.useRef(null);
  const [frame, setFrame] = React.useState(initialMetrics.frame);
  React.useEffect(() => {
    if (element.current == null) {
      return;
    }
    const rect = element.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFrame({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    });
    let timeout;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const {
          x,
          y,
          width,
          height
        } = entry.contentRect;

        // Debounce the frame updates to avoid too many updates in a short time
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setFrame({
            x,
            y,
            width,
            height
          });
        }, 100);
      }
    });
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNativeSafeAreaContext.SafeAreaFrameContext.Provider, {
    value: frame,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      ref: element,
      style: {
        ..._reactNative.StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
        visibility: 'hidden'
      }
    }), children]
  });
};
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=SafeAreaProviderCompat.js.map