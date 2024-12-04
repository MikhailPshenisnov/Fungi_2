"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNamedContext = getNamedContext;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const contexts = '__react_navigation__elements_contexts';
// We use a global variable to keep our contexts so that we can reuse same contexts across packages
globalThis[contexts] = globalThis[contexts] ?? new Map();
function getNamedContext(name, initialValue) {
  let context = globalThis[contexts].get(name);
  if (context) {
    return context;
  }
  context = /*#__PURE__*/React.createContext(initialValue);
  context.displayName = name;
  globalThis[contexts].set(name, context);
  return context;
}
//# sourceMappingURL=getNamedContext.js.map