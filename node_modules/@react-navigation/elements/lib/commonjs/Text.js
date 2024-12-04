"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = Text;
var _native = require("@react-navigation/native");
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
// eslint-disable-next-line no-restricted-imports

function Text({
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = (0, _native.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
    ...rest,
    style: [{
      color: colors.text
    }, fonts.regular, style]
  });
}
//# sourceMappingURL=Text.js.map