"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkBuilder = useLinkBuilder;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _LinkingContext = require("./LinkingContext.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getRootStateForNavigate = (navigation, state) => {
  const parent = navigation.getParent();
  if (parent) {
    const parentState = parent.getState();
    return getRootStateForNavigate(parent, {
      index: 0,
      routes: [{
        ...parentState.routes[parentState.index],
        state: state
      }]
    });
  }
  return state;
};

/**
 * Helpers to build href or action based on the linking options.
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
function useLinkBuilder() {
  const navigation = React.useContext(_core.NavigationHelpersContext);
  const linking = React.useContext(_LinkingContext.LinkingContext);
  const buildHref = React.useCallback((name, params) => {
    const {
      options
    } = linking;
    if (options?.enabled === false) {
      return undefined;
    }
    const state = navigation ? getRootStateForNavigate(navigation, {
      index: 0,
      routes: [{
        name,
        params
      }]
    }) :
    // If we couldn't find a navigation object in context, we're at root
    // So we'll construct a basic state object to use
    {
      index: 0,
      routes: [{
        name,
        params
      }]
    };
    const path = options?.getPathFromState ? options.getPathFromState(state, options?.config) : (0, _core.getPathFromState)(state, options?.config);
    return path;
  }, [linking, navigation]);
  const buildAction = React.useCallback(href => {
    if (!href.startsWith('/')) {
      throw new Error(`The href must start with '/' (${href}).`);
    }
    const {
      options
    } = linking;
    const state = options?.getStateFromPath ? options.getStateFromPath(href, options.config) : (0, _core.getStateFromPath)(href, options?.config);
    if (state) {
      const action = (0, _core.getActionFromState)(state, options?.config);
      return action ?? _core.CommonActions.reset(state);
    } else {
      throw new Error('Failed to parse the href to a navigation state.');
    }
  }, [linking]);
  return {
    buildHref,
    buildAction
  };
}
//# sourceMappingURL=useLinkBuilder.js.map