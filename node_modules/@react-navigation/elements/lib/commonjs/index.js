"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Assets: true,
  Background: true,
  Button: true,
  getDefaultSidebarWidth: true,
  getDefaultHeaderHeight: true,
  getHeaderTitle: true,
  Header: true,
  HeaderBackButton: true,
  HeaderBackContext: true,
  HeaderBackground: true,
  HeaderButton: true,
  HeaderHeightContext: true,
  HeaderShownContext: true,
  HeaderTitle: true,
  useHeaderHeight: true,
  getLabel: true,
  Label: true,
  MissingIcon: true,
  PlatformPressable: true,
  ResourceSavingView: true,
  SafeAreaProviderCompat: true,
  Screen: true,
  Text: true
};
exports.Assets = void 0;
Object.defineProperty(exports, "Background", {
  enumerable: true,
  get: function () {
    return _Background.Background;
  }
});
Object.defineProperty(exports, "Button", {
  enumerable: true,
  get: function () {
    return _Button.Button;
  }
});
Object.defineProperty(exports, "Header", {
  enumerable: true,
  get: function () {
    return _Header.Header;
  }
});
Object.defineProperty(exports, "HeaderBackButton", {
  enumerable: true,
  get: function () {
    return _HeaderBackButton.HeaderBackButton;
  }
});
Object.defineProperty(exports, "HeaderBackContext", {
  enumerable: true,
  get: function () {
    return _HeaderBackContext.HeaderBackContext;
  }
});
Object.defineProperty(exports, "HeaderBackground", {
  enumerable: true,
  get: function () {
    return _HeaderBackground.HeaderBackground;
  }
});
Object.defineProperty(exports, "HeaderButton", {
  enumerable: true,
  get: function () {
    return _HeaderButton.HeaderButton;
  }
});
Object.defineProperty(exports, "HeaderHeightContext", {
  enumerable: true,
  get: function () {
    return _HeaderHeightContext.HeaderHeightContext;
  }
});
Object.defineProperty(exports, "HeaderShownContext", {
  enumerable: true,
  get: function () {
    return _HeaderShownContext.HeaderShownContext;
  }
});
Object.defineProperty(exports, "HeaderTitle", {
  enumerable: true,
  get: function () {
    return _HeaderTitle.HeaderTitle;
  }
});
Object.defineProperty(exports, "Label", {
  enumerable: true,
  get: function () {
    return _Label.Label;
  }
});
Object.defineProperty(exports, "MissingIcon", {
  enumerable: true,
  get: function () {
    return _MissingIcon.MissingIcon;
  }
});
Object.defineProperty(exports, "PlatformPressable", {
  enumerable: true,
  get: function () {
    return _PlatformPressable.PlatformPressable;
  }
});
Object.defineProperty(exports, "ResourceSavingView", {
  enumerable: true,
  get: function () {
    return _ResourceSavingView.ResourceSavingView;
  }
});
Object.defineProperty(exports, "SafeAreaProviderCompat", {
  enumerable: true,
  get: function () {
    return _SafeAreaProviderCompat.SafeAreaProviderCompat;
  }
});
Object.defineProperty(exports, "Screen", {
  enumerable: true,
  get: function () {
    return _Screen.Screen;
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function () {
    return _Text.Text;
  }
});
Object.defineProperty(exports, "getDefaultHeaderHeight", {
  enumerable: true,
  get: function () {
    return _getDefaultHeaderHeight.getDefaultHeaderHeight;
  }
});
Object.defineProperty(exports, "getDefaultSidebarWidth", {
  enumerable: true,
  get: function () {
    return _getDefaultSidebarWidth.getDefaultSidebarWidth;
  }
});
Object.defineProperty(exports, "getHeaderTitle", {
  enumerable: true,
  get: function () {
    return _getHeaderTitle.getHeaderTitle;
  }
});
Object.defineProperty(exports, "getLabel", {
  enumerable: true,
  get: function () {
    return _getLabel.getLabel;
  }
});
Object.defineProperty(exports, "useHeaderHeight", {
  enumerable: true,
  get: function () {
    return _useHeaderHeight.useHeaderHeight;
  }
});
var _backIcon = _interopRequireDefault(require("./assets/back-icon.png"));
var _backIconMask = _interopRequireDefault(require("./assets/back-icon-mask.png"));
var _clearIcon = _interopRequireDefault(require("./assets/clear-icon.png"));
var _closeIcon = _interopRequireDefault(require("./assets/close-icon.png"));
var _searchIcon = _interopRequireDefault(require("./assets/search-icon.png"));
var _Background = require("./Background.js");
var _Button = require("./Button.js");
var _getDefaultSidebarWidth = require("./getDefaultSidebarWidth.js");
var _getDefaultHeaderHeight = require("./Header/getDefaultHeaderHeight.js");
var _getHeaderTitle = require("./Header/getHeaderTitle.js");
var _Header = require("./Header/Header.js");
var _HeaderBackButton = require("./Header/HeaderBackButton.js");
var _HeaderBackContext = require("./Header/HeaderBackContext.js");
var _HeaderBackground = require("./Header/HeaderBackground.js");
var _HeaderButton = require("./Header/HeaderButton.js");
var _HeaderHeightContext = require("./Header/HeaderHeightContext.js");
var _HeaderShownContext = require("./Header/HeaderShownContext.js");
var _HeaderTitle = require("./Header/HeaderTitle.js");
var _useHeaderHeight = require("./Header/useHeaderHeight.js");
var _getLabel = require("./Label/getLabel.js");
var _Label = require("./Label/Label.js");
var _MissingIcon = require("./MissingIcon.js");
var _PlatformPressable = require("./PlatformPressable.js");
var _ResourceSavingView = require("./ResourceSavingView.js");
var _SafeAreaProviderCompat = require("./SafeAreaProviderCompat.js");
var _Screen = require("./Screen.js");
var _Text = require("./Text.js");
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Assets = exports.Assets = [_backIcon.default, _backIconMask.default, _searchIcon.default, _closeIcon.default, _clearIcon.default];
//# sourceMappingURL=index.js.map