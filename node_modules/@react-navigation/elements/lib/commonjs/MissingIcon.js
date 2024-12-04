"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MissingIcon = MissingIcon;
var _reactNative = require("react-native");
var _Text = require("./Text.js");
var _jsxRuntime = require("react/jsx-runtime");
function MissingIcon({
  color,
  size,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    style: [styles.icon, {
      color,
      fontSize: size
    }, style],
    children: "\u23F7"
  });
}
const styles = _reactNative.StyleSheet.create({
  icon: {
    backgroundColor: 'transparent'
  }
});
//# sourceMappingURL=MissingIcon.js.map