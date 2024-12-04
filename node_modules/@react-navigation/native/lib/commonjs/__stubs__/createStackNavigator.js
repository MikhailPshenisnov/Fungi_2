"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStackNavigator = createStackNavigator;
var _core = require("@react-navigation/core");
var _jsxRuntime = require("react/jsx-runtime");
const StackNavigator = props => {
  const {
    state,
    descriptors,
    NavigationContent
  } = (0, _core.useNavigationBuilder)(_core.StackRouter, props);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(NavigationContent, {
    children: descriptors[state.routes[state.index].key].render()
  });
};
function createStackNavigator() {
  return (0, _core.createNavigatorFactory)(StackNavigator)();
}
//# sourceMappingURL=createStackNavigator.js.map