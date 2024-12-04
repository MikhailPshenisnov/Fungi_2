"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkProps = useLinkProps;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _LinkingContext = require("./LinkingContext.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getStateFromParams = params => {
  if (params?.state) {
    return params.state;
  }
  if (params?.screen) {
    return {
      routes: [{
        name: params.screen,
        params: params.params,
        // @ts-expect-error this is fine 🔥
        state: params.screen ? getStateFromParams(params.params) : undefined
      }]
    };
  }
  return undefined;
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
function useLinkProps({
  screen,
  params,
  href,
  action
}) {
  const root = React.useContext(_core.NavigationContainerRefContext);
  const navigation = React.useContext(_core.NavigationHelpersContext);
  const {
    options
  } = React.useContext(_LinkingContext.LinkingContext);
  const onPress = e => {
    // @ts-expect-error: these properties exist on web, but not in React Native
    const hasModifierKey = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey; // ignore clicks with modifier keys
    // @ts-expect-error: these properties exist on web, but not in React Native
    const isLeftClick = e.button == null || e.button === 0; // only handle left clicks
    const isSelfTarget = [undefined, null, '', 'self'].includes(
    // @ts-expect-error: these properties exist on web, but not in React Native
    e.currentTarget?.target); // let browser handle "target=_blank" etc.

    let shouldHandle = false;
    if (_reactNative.Platform.OS !== 'web' || !e) {
      shouldHandle = true;
    } else if (!hasModifierKey && isLeftClick && isSelfTarget) {
      e.preventDefault();
      shouldHandle = true;
    }
    if (shouldHandle) {
      if (action) {
        if (navigation) {
          navigation.dispatch(action);
        } else if (root) {
          root.dispatch(action);
        } else {
          throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
        }
      } else {
        // @ts-expect-error This is already type-checked by the prop types
        navigation?.navigate(screen, params);
      }
    }
  };
  const getPathFromStateHelper = options?.getPathFromState ?? _core.getPathFromState;
  return {
    href: href ?? (_reactNative.Platform.OS === 'web' && screen != null ? getPathFromStateHelper({
      routes: [{
        // @ts-expect-error this is fine 🔥
        name: screen,
        // @ts-expect-error this is fine 🔥
        params: params,
        // @ts-expect-error this is fine 🔥
        state: getStateFromParams(params)
      }]
    }, options?.config) : undefined),
    accessibilityRole: 'link',
    onPress
  };
}
//# sourceMappingURL=useLinkProps.js.map