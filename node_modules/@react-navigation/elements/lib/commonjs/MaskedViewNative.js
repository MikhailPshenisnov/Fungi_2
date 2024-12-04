"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaskedView = MaskedView;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * The native MaskedView that we explicitly re-export for supported platforms: Android, iOS.
 */

let RNCMaskedView;
try {
  // Add try/catch to support usage even if it's not installed, since it's optional.
  // Newer versions of Metro will handle it properly.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  RNCMaskedView = require('@react-native-masked-view/masked-view').default;
} catch (e) {
  // Ignore
}
const isMaskedViewAvailable = _reactNative.UIManager.getViewManagerConfig('RNCMaskedView') != null;
function MaskedView({
  children,
  ...rest
}) {
  if (isMaskedViewAvailable && RNCMaskedView) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(RNCMaskedView, {
      ...rest,
      children: children
    });
  }
  return children;
}
//# sourceMappingURL=MaskedViewNative.js.map