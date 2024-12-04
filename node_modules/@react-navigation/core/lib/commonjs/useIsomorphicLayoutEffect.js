"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsomorphicLayoutEffect = void 0;
var _react = require("react");
/**
 * Use `useEffect` during SSR and `useLayoutEffect` in the browser to avoid warnings.
 */
const useIsomorphicLayoutEffect = exports.useIsomorphicLayoutEffect = typeof document !== 'undefined' ? _react.useLayoutEffect : _react.useEffect;
//# sourceMappingURL=useIsomorphicLayoutEffect.js.map