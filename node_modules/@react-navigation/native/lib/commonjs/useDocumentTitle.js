"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDocumentTitle = useDocumentTitle;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Set the document title for the active screen
 */
function useDocumentTitle(ref, {
  enabled = true,
  formatter = (options, route) => options?.title ?? route?.name
} = {}) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    const navigation = ref.current;
    if (navigation) {
      const title = formatter(navigation.getCurrentOptions(), navigation.getCurrentRoute());
      document.title = title;
    }
    return navigation?.addListener('options', e => {
      const title = formatter(e.data.options, navigation?.getCurrentRoute());
      document.title = title;
    });
  });
}
//# sourceMappingURL=useDocumentTitle.js.map