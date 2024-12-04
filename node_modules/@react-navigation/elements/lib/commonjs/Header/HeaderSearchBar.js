"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderSearchBar = void 0;
var _native = require("@react-navigation/native");
var _color = _interopRequireDefault(require("color"));
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _clearIcon = _interopRequireDefault(require("../assets/clear-icon.png"));
var _closeIcon = _interopRequireDefault(require("../assets/close-icon.png"));
var _searchIcon = _interopRequireDefault(require("../assets/search-icon.png"));
var _PlatformPressable = require("../PlatformPressable.js");
var _Text = require("../Text.js");
var _HeaderButton = require("./HeaderButton.js");
var _HeaderIcon = require("./HeaderIcon.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const INPUT_TYPE_TO_MODE = {
  text: 'text',
  number: 'numeric',
  phone: 'tel',
  email: 'email'
};
const useNativeDriver = _reactNative.Platform.OS !== 'web';
function HeaderSearchBarInternal({
  visible,
  inputType,
  autoFocus = true,
  placeholder = 'Search',
  cancelButtonText = 'Cancel',
  onChangeText,
  onClose,
  style,
  ...rest
}, ref) {
  const navigation = (0, _native.useNavigation)();
  const {
    dark,
    colors,
    fonts
  } = (0, _native.useTheme)();
  const [value, setValue] = React.useState('');
  const [rendered, setRendered] = React.useState(visible);
  const [visibleAnim] = React.useState(() => new _reactNative.Animated.Value(visible ? 1 : 0));
  const [clearVisibleAnim] = React.useState(() => new _reactNative.Animated.Value(0));
  const visibleValueRef = React.useRef(visible);
  const clearVisibleValueRef = React.useRef(false);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    // Avoid act warning in tests just by rendering header
    if (visible === visibleValueRef.current) {
      return;
    }
    _reactNative.Animated.timing(visibleAnim, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        setRendered(visible);
        visibleValueRef.current = visible;
      }
    });
    return () => {
      visibleAnim.stopAnimation();
    };
  }, [visible, visibleAnim]);
  const hasText = value !== '';
  React.useEffect(() => {
    if (clearVisibleValueRef.current === hasText) {
      return;
    }
    _reactNative.Animated.timing(clearVisibleAnim, {
      toValue: hasText ? 1 : 0,
      duration: 100,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        clearVisibleValueRef.current = hasText;
      }
    });
  }, [clearVisibleAnim, hasText]);
  const clearText = React.useCallback(() => {
    inputRef.current?.clear();
    inputRef.current?.focus();
    setValue('');
  }, []);
  const onClear = React.useCallback(() => {
    clearText();
    // FIXME: figure out how to create a SyntheticEvent
    // @ts-expect-error: we don't have the native event here
    onChangeText?.({
      nativeEvent: {
        text: ''
      }
    });
  }, [clearText, onChangeText]);
  const cancelSearch = React.useCallback(() => {
    onClear();
    onClose();
  }, [onClear, onClose]);
  React.useEffect(() => navigation?.addListener('blur', cancelSearch), [cancelSearch, navigation]);
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    setText: text => {
      inputRef.current?.setNativeProps({
        text
      });
      setValue(text);
    },
    clearText,
    cancelSearch
  }), [cancelSearch, clearText]);
  if (!visible && !rendered) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Animated.View, {
    pointerEvents: visible ? 'auto' : 'none',
    accessibilityLiveRegion: "polite",
    accessibilityElementsHidden: !visible,
    importantForAccessibility: visible ? 'auto' : 'no-hide-descendants',
    style: [styles.container, {
      opacity: visibleAnim
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.searchbarContainer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderIcon.HeaderIcon, {
        source: _searchIcon.default,
        style: styles.inputSearchIcon
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
        ...rest,
        ref: inputRef,
        onChange: onChangeText,
        onChangeText: setValue,
        autoFocus: autoFocus,
        inputMode: INPUT_TYPE_TO_MODE[inputType ?? 'text'],
        placeholder: placeholder,
        placeholderTextColor: (0, _color.default)(colors.text).alpha(0.5).string(),
        cursorColor: colors.primary,
        selectionHandleColor: colors.primary,
        selectionColor: (0, _color.default)(colors.primary).alpha(0.3).string(),
        style: [fonts.regular, styles.searchbar, {
          backgroundColor: _reactNative.Platform.select({
            ios: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            default: 'transparent'
          }),
          color: colors.text,
          borderBottomColor: colors.border
        }]
      }), _reactNative.Platform.OS === 'ios' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_PlatformPressable.PlatformPressable, {
        onPress: onClear,
        style: [{
          opacity: clearVisibleAnim,
          transform: [{
            scale: clearVisibleAnim
          }]
        }, styles.clearButton],
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
          source: _clearIcon.default,
          resizeMode: "contain",
          tintColor: colors.text,
          style: styles.clearIcon
        })
      }) : null]
    }), _reactNative.Platform.OS !== 'ios' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderButton.HeaderButton, {
      onPress: () => {
        if (value) {
          onClear();
        } else {
          onClose();
        }
      },
      style: styles.closeButton,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderIcon.HeaderIcon, {
        source: _closeIcon.default
      })
    }) : null, _reactNative.Platform.OS === 'ios' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_PlatformPressable.PlatformPressable, {
      onPress: cancelSearch,
      style: styles.cancelButton,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        style: [fonts.regular, {
          color: colors.primary
        }, styles.cancelText],
        children: cancelButtonText
      })
    }) : null]
  });
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  inputSearchIcon: {
    position: 'absolute',
    opacity: 0.5,
    left: _reactNative.Platform.select({
      ios: 16,
      default: 4
    }),
    top: _reactNative.Platform.select({
      ios: -1,
      default: 17
    }),
    ..._reactNative.Platform.select({
      ios: {
        height: 18,
        width: 18
      },
      default: {}
    })
  },
  closeButton: {
    position: 'absolute',
    opacity: 0.5,
    right: _reactNative.Platform.select({
      ios: 0,
      default: 8
    }),
    top: _reactNative.Platform.select({
      ios: -2,
      default: 17
    })
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: -7,
    bottom: 0,
    justifyContent: 'center',
    padding: 8
  },
  clearIcon: {
    height: 16,
    width: 16,
    opacity: 0.5
  },
  cancelButton: {
    alignSelf: 'center',
    top: -4
  },
  cancelText: {
    fontSize: 17,
    marginHorizontal: 12
  },
  searchbarContainer: {
    flex: 1
  },
  searchbar: _reactNative.Platform.select({
    ios: {
      flex: 1,
      fontSize: 17,
      paddingHorizontal: 32,
      marginLeft: 16,
      marginTop: -2,
      marginBottom: 5,
      borderRadius: 8
    },
    default: {
      flex: 1,
      fontSize: 18,
      paddingHorizontal: 36,
      marginRight: 8,
      marginTop: 8,
      marginBottom: 8,
      borderBottomWidth: 1
    }
  })
});
const HeaderSearchBar = exports.HeaderSearchBar = /*#__PURE__*/React.forwardRef(HeaderSearchBarInternal);
//# sourceMappingURL=HeaderSearchBar.js.map