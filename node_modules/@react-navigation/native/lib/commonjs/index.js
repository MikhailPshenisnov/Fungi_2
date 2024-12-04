"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createStaticNavigation: true,
  Link: true,
  LinkingContext: true,
  LocaleDirContext: true,
  NavigationContainer: true,
  ServerContainer: true,
  DarkTheme: true,
  DefaultTheme: true,
  UNSTABLE_UnhandledLinkingContext: true,
  useLinkBuilder: true,
  useLinkProps: true,
  useLinkTo: true,
  useLocale: true,
  useScrollToTop: true
};
Object.defineProperty(exports, "DarkTheme", {
  enumerable: true,
  get: function () {
    return _DarkTheme.DarkTheme;
  }
});
Object.defineProperty(exports, "DefaultTheme", {
  enumerable: true,
  get: function () {
    return _DefaultTheme.DefaultTheme;
  }
});
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function () {
    return _Link.Link;
  }
});
Object.defineProperty(exports, "LinkingContext", {
  enumerable: true,
  get: function () {
    return _LinkingContext.LinkingContext;
  }
});
Object.defineProperty(exports, "LocaleDirContext", {
  enumerable: true,
  get: function () {
    return _LocaleDirContext.LocaleDirContext;
  }
});
Object.defineProperty(exports, "NavigationContainer", {
  enumerable: true,
  get: function () {
    return _NavigationContainer.NavigationContainer;
  }
});
Object.defineProperty(exports, "ServerContainer", {
  enumerable: true,
  get: function () {
    return _ServerContainer.ServerContainer;
  }
});
Object.defineProperty(exports, "UNSTABLE_UnhandledLinkingContext", {
  enumerable: true,
  get: function () {
    return _UnhandledLinkingContext.UnhandledLinkingContext;
  }
});
Object.defineProperty(exports, "createStaticNavigation", {
  enumerable: true,
  get: function () {
    return _createStaticNavigation.createStaticNavigation;
  }
});
Object.defineProperty(exports, "useLinkBuilder", {
  enumerable: true,
  get: function () {
    return _useLinkBuilder.useLinkBuilder;
  }
});
Object.defineProperty(exports, "useLinkProps", {
  enumerable: true,
  get: function () {
    return _useLinkProps.useLinkProps;
  }
});
Object.defineProperty(exports, "useLinkTo", {
  enumerable: true,
  get: function () {
    return _useLinkTo.useLinkTo;
  }
});
Object.defineProperty(exports, "useLocale", {
  enumerable: true,
  get: function () {
    return _useLocale.useLocale;
  }
});
Object.defineProperty(exports, "useScrollToTop", {
  enumerable: true,
  get: function () {
    return _useScrollToTop.useScrollToTop;
  }
});
var _createStaticNavigation = require("./createStaticNavigation.js");
var _Link = require("./Link.js");
var _LinkingContext = require("./LinkingContext.js");
var _LocaleDirContext = require("./LocaleDirContext.js");
var _NavigationContainer = require("./NavigationContainer.js");
var _ServerContainer = require("./ServerContainer.js");
var _DarkTheme = require("./theming/DarkTheme.js");
var _DefaultTheme = require("./theming/DefaultTheme.js");
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
var _UnhandledLinkingContext = require("./UnhandledLinkingContext.js");
var _useLinkBuilder = require("./useLinkBuilder.js");
var _useLinkProps = require("./useLinkProps.js");
var _useLinkTo = require("./useLinkTo.js");
var _useLocale = require("./useLocale.js");
var _useScrollToTop = require("./useScrollToTop.js");
var _core = require("@react-navigation/core");
Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _core[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _core[key];
    }
  });
});
//# sourceMappingURL=index.js.map