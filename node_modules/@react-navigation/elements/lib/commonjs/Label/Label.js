"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Label = Label;
var _reactNative = require("react-native");
var _Text = require("../Text.js");
var _jsxRuntime = require("react/jsx-runtime");
function Label({
  tintColor,
  style,
  ...rest
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    numberOfLines: 1,
    ...rest,
    style: [styles.label, tintColor != null && {
      color: tintColor
    }, style]
  });
}
const styles = _reactNative.StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
//# sourceMappingURL=Label.js.map