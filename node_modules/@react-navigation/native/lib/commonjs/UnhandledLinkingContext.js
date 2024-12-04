"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnhandledLinkingContext = void 0;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MISSING_CONTEXT_ERROR = "Couldn't find an UnhandledLinkingContext context.";
const UnhandledLinkingContext = exports.UnhandledLinkingContext = /*#__PURE__*/React.createContext({
  get lastUnhandledLink() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setLastUnhandledLink() {
    throw new Error(MISSING_CONTEXT_ERROR);
  }
});
UnhandledLinkingContext.displayName = 'UnhandledLinkingContext';
//# sourceMappingURL=UnhandledLinkingContext.js.map