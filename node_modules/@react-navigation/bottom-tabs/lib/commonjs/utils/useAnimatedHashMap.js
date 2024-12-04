"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatedHashMap = useAnimatedHashMap;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useAnimatedHashMap({
  routes,
  index
}) {
  const refs = React.useRef({});
  const previous = refs.current;
  const routeKeys = Object.keys(previous);
  if (routes.length === routeKeys.length && routes.every(route => routeKeys.includes(route.key))) {
    return previous;
  }
  refs.current = {};
  routes.forEach(({
    key
  }, i) => {
    refs.current[key] = previous[key] ?? new _reactNative.Animated.Value(i === index ? 0 : i >= index ? 1 : -1);
  });
  return refs.current;
}
//# sourceMappingURL=useAnimatedHashMap.js.map