"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerContainer = void 0;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _ServerContext = require("./ServerContext.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Container component for server rendering.
 *
 * @param props.location Location object to base the initial URL for SSR.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which contains helper methods.
 */
const ServerContainer = exports.ServerContainer = /*#__PURE__*/React.forwardRef(function ServerContainer({
  children,
  location
}, ref) {
  React.useEffect(() => {
    console.error("'ServerContainer' should only be used on the server with 'react-dom/server' for SSR.");
  }, []);

  // eslint-disable-next-line @eslint-react/no-unstable-context-value
  const current = {};
  if (ref) {
    const value = {
      getCurrentOptions() {
        return current.options;
      }
    };

    // We write to the `ref` during render instead of `React.useImperativeHandle`
    // This is because `useImperativeHandle` will update the ref after 'commit',
    // and there's no 'commit' phase during SSR.
    // Mutating ref during render is unsafe in concurrent mode, but we don't care about it for SSR.
    if (typeof ref === 'function') {
      ref(value);
    } else {
      // @ts-expect-error: the TS types are incorrect and say that ref.current is readonly
      ref.current = value;
    }
  }
  return (
    /*#__PURE__*/
    // eslint-disable-next-line @eslint-react/no-unstable-context-value
    (0, _jsxRuntime.jsx)(_ServerContext.ServerContext.Provider, {
      value: {
        location
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_core.CurrentRenderContext.Provider, {
        value: current,
        children: children
      })
    })
  );
});
//# sourceMappingURL=ServerContainer.js.map