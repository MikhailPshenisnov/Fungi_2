"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  CommonActions: true,
  BaseRouter: true,
  DrawerActions: true,
  DrawerRouter: true,
  StackActions: true,
  StackRouter: true,
  TabActions: true,
  TabRouter: true
};
Object.defineProperty(exports, "BaseRouter", {
  enumerable: true,
  get: function () {
    return _BaseRouter.BaseRouter;
  }
});
exports.CommonActions = void 0;
Object.defineProperty(exports, "DrawerActions", {
  enumerable: true,
  get: function () {
    return _DrawerRouter.DrawerActions;
  }
});
Object.defineProperty(exports, "DrawerRouter", {
  enumerable: true,
  get: function () {
    return _DrawerRouter.DrawerRouter;
  }
});
Object.defineProperty(exports, "StackActions", {
  enumerable: true,
  get: function () {
    return _StackRouter.StackActions;
  }
});
Object.defineProperty(exports, "StackRouter", {
  enumerable: true,
  get: function () {
    return _StackRouter.StackRouter;
  }
});
Object.defineProperty(exports, "TabActions", {
  enumerable: true,
  get: function () {
    return _TabRouter.TabActions;
  }
});
Object.defineProperty(exports, "TabRouter", {
  enumerable: true,
  get: function () {
    return _TabRouter.TabRouter;
  }
});
var CommonActions = _interopRequireWildcard(require("./CommonActions.js"));
exports.CommonActions = CommonActions;
var _BaseRouter = require("./BaseRouter.js");
var _DrawerRouter = require("./DrawerRouter.js");
var _StackRouter = require("./StackRouter.js");
var _TabRouter = require("./TabRouter.js");
var _types = require("./types.js");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//# sourceMappingURL=index.js.map