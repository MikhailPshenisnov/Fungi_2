"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useThenable = useThenable;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useThenable(create) {
  const [promise] = React.useState(create);
  let initialState = [false, undefined];

  // Check if our thenable is synchronous
  // eslint-disable-next-line promise/catch-or-return, promise/always-return
  promise.then(result => {
    initialState = [true, result];
  });
  const [state, setState] = React.useState(initialState);
  const [resolved] = state;
  React.useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      let result;
      try {
        result = await promise;
      } finally {
        if (!cancelled) {
          setState([true, result]);
        }
      }
    };
    if (!resolved) {
      resolve();
    }
    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);
  return state;
}
//# sourceMappingURL=useThenable.js.map