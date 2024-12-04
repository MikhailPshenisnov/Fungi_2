"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinkTo = useLinkTo;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _useLinkBuilder = require("./useLinkBuilder.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Helper to navigate to a screen using a href based on the linking options.
 * @returns function that receives the href to navigate to.
 */
function useLinkTo() {
  const navigation = React.useContext(_core.NavigationContainerRefContext);
  const {
    buildAction
  } = (0, _useLinkBuilder.useLinkBuilder)();
  const linkTo = React.useCallback(href => {
    if (navigation === undefined) {
      throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
    }
    const action = buildAction(href);
    navigation.dispatch(action);
  }, [buildAction, navigation]);
  return linkTo;
}
//# sourceMappingURL=useLinkTo.js.map