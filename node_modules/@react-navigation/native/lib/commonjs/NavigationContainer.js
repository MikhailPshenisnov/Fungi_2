"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavigationContainer = void 0;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _useLatestCallback = _interopRequireDefault(require("use-latest-callback"));
var _LinkingContext = require("./LinkingContext.js");
var _LocaleDirContext = require("./LocaleDirContext.js");
var _DefaultTheme = require("./theming/DefaultTheme.js");
var _UnhandledLinkingContext = require("./UnhandledLinkingContext.js");
var _useBackButton = require("./useBackButton");
var _useDocumentTitle = require("./useDocumentTitle");
var _useLinking = require("./useLinking");
var _useThenable = require("./useThenable.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();
/**
 * Container component which holds the navigation state designed for React Native apps.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree. When deep link handling is enabled, this will override deep links when specified. Make sure that you don't specify an `initialState` when there's a deep link (`Linking.getInitialURL()`).
 * @param props.onReady Callback which is called after the navigation tree mounts.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.onUnhandledAction Callback which is called when an action is not handled.
 * @param props.direction Text direction of the components. Defaults to `'ltr'`.
 * @param props.theme Theme object for the UI elements.
 * @param props.linking Options for deep linking. Deep link handling is enabled when this prop is provided, unless `linking.enabled` is `false`.
 * @param props.fallback Fallback component to render until we have finished getting initial state when linking is enabled. Defaults to `null`.
 * @param props.documentTitle Options to configure the document title on Web. Updating document title is handled by default unless `documentTitle.enabled` is `false`.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
function NavigationContainerInner({
  direction = _reactNative.I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  theme = _DefaultTheme.DefaultTheme,
  linking,
  fallback = null,
  documentTitle,
  onReady,
  onStateChange,
  ...rest
}, ref) {
  const isLinkingEnabled = linking ? linking.enabled !== false : false;
  if (linking?.config) {
    (0, _core.validatePathConfig)(linking.config);
  }
  const refContainer = React.useRef(null);
  (0, _useBackButton.useBackButton)(refContainer);
  (0, _useDocumentTitle.useDocumentTitle)(refContainer, documentTitle);
  const [lastUnhandledLink, setLastUnhandledLink] = React.useState();
  const {
    getInitialState
  } = (0, _useLinking.useLinking)(refContainer, {
    enabled: isLinkingEnabled,
    prefixes: [],
    ...linking
  }, setLastUnhandledLink);
  const linkingContext = React.useMemo(() => ({
    options: linking
  }), [linking]);
  const unhandledLinkingContext = React.useMemo(() => ({
    lastUnhandledLink,
    setLastUnhandledLink
  }), [lastUnhandledLink, setLastUnhandledLink]);
  const onReadyForLinkingHandling = (0, _useLatestCallback.default)(() => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onReady?.();
  });
  const onStateChangeForLinkingHandling = (0, _useLatestCallback.default)(state => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onStateChange?.(state);
  });
  // Add additional linking related info to the ref
  // This will be used by the devtools
  React.useEffect(() => {
    if (refContainer.current) {
      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return {
            ...linking,
            enabled: isLinkingEnabled,
            prefixes: linking?.prefixes ?? [],
            getStateFromPath: linking?.getStateFromPath ?? _core.getStateFromPath,
            getPathFromState: linking?.getPathFromState ?? _core.getPathFromState,
            getActionFromState: linking?.getActionFromState ?? _core.getActionFromState
          };
        }
      });
    }
  });
  const [isResolved, initialState] = (0, _useThenable.useThenable)(getInitialState);
  React.useImperativeHandle(ref, () => refContainer.current);
  const isLinkingReady = rest.initialState != null || !isLinkingEnabled || isResolved;
  if (!isLinkingReady) {
    // This is temporary until we have Suspense for data-fetching
    // Then the fallback will be handled by a parent `Suspense` component
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_core.ThemeProvider, {
      value: theme,
      children: fallback
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_LocaleDirContext.LocaleDirContext.Provider, {
    value: direction,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_UnhandledLinkingContext.UnhandledLinkingContext.Provider, {
      value: unhandledLinkingContext,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_LinkingContext.LinkingContext.Provider, {
        value: linkingContext,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_core.BaseNavigationContainer, {
          ...rest,
          theme: theme,
          onReady: onReadyForLinkingHandling,
          onStateChange: onStateChangeForLinkingHandling,
          initialState: rest.initialState == null ? initialState : rest.initialState,
          ref: refContainer
        })
      })
    })
  });
}
const NavigationContainer = exports.NavigationContainer = /*#__PURE__*/React.forwardRef(NavigationContainerInner);
//# sourceMappingURL=NavigationContainer.js.map