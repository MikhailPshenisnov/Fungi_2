"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsKeyboardShown = useIsKeyboardShown;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);
  React.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);
    let subscriptions;
    if (_reactNative.Platform.OS === 'ios') {
      subscriptions = [_reactNative.Keyboard.addListener('keyboardWillShow', handleKeyboardShow), _reactNative.Keyboard.addListener('keyboardWillHide', handleKeyboardHide)];
    } else {
      subscriptions = [_reactNative.Keyboard.addListener('keyboardDidShow', handleKeyboardShow), _reactNative.Keyboard.addListener('keyboardDidHide', handleKeyboardHide)];
    }
    return () => {
      subscriptions.forEach(s => s.remove());
    };
  }, []);
  return isKeyboardShown;
}
//# sourceMappingURL=useIsKeyboardShown.js.map