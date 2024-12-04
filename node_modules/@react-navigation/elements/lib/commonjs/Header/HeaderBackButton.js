"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderBackButton = HeaderBackButton;
var _native = require("@react-navigation/native");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _backIcon = _interopRequireDefault(require("../assets/back-icon.png"));
var _backIconMask = _interopRequireDefault(require("../assets/back-icon-mask.png"));
var _MaskedView = require("../MaskedView");
var _HeaderButton = require("./HeaderButton.js");
var _HeaderIcon = require("./HeaderIcon.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function HeaderBackButton({
  disabled,
  allowFontScaling,
  backImage,
  label,
  labelStyle,
  displayMode = _reactNative.Platform.OS === 'ios' ? 'default' : 'minimal',
  onLabelLayout,
  onPress,
  pressColor,
  pressOpacity,
  screenLayout,
  tintColor,
  titleLayout,
  truncatedLabel = 'Back',
  accessibilityLabel = label && label !== 'Back' ? `${label}, back` : 'Go back',
  testID,
  style,
  href
}) {
  const {
    colors,
    fonts
  } = (0, _native.useTheme)();
  const {
    direction
  } = (0, _native.useLocale)();
  const [labelWidth, setLabelWidth] = React.useState(null);
  const [truncatedLabelWidth, setTruncatedLabelWidth] = React.useState(null);
  const renderBackImage = () => {
    if (backImage) {
      return backImage({
        tintColor: tintColor ?? colors.text
      });
    } else {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderIcon.HeaderIcon, {
        source: _backIcon.default,
        tintColor: tintColor,
        style: [styles.icon, displayMode !== 'minimal' && styles.iconWithLabel]
      });
    }
  };
  const renderLabel = () => {
    if (displayMode === 'minimal') {
      return null;
    }
    const availableSpace = titleLayout && screenLayout ? (screenLayout.width - titleLayout.width) / 2 - (ICON_WIDTH + _HeaderIcon.ICON_MARGIN) : null;
    const potentialLabelText = displayMode === 'default' ? label : truncatedLabel;
    const finalLabelText = availableSpace && labelWidth && truncatedLabelWidth ? availableSpace > labelWidth ? potentialLabelText : availableSpace > truncatedLabelWidth ? truncatedLabel : null : potentialLabelText;
    const commonStyle = [fonts.regular, styles.label, labelStyle];
    const hiddenStyle = [commonStyle, {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    }];
    const labelElement = /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.labelWrapper,
      children: [label && displayMode === 'default' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.Text, {
        style: hiddenStyle,
        numberOfLines: 1,
        onLayout: e => setLabelWidth(e.nativeEvent.layout.width),
        children: label
      }) : null, truncatedLabel ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.Text, {
        style: hiddenStyle,
        numberOfLines: 1,
        onLayout: e => setTruncatedLabelWidth(e.nativeEvent.layout.width),
        children: truncatedLabel
      }) : null, finalLabelText ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Animated.Text, {
        accessible: false,
        onLayout: onLabelLayout,
        style: [tintColor ? {
          color: tintColor
        } : null, commonStyle],
        numberOfLines: 1,
        allowFontScaling: !!allowFontScaling,
        children: finalLabelText
      }) : null]
    });
    if (backImage || _reactNative.Platform.OS !== 'ios') {
      // When a custom backimage is specified, we can't mask the label
      // Otherwise there might be weird effect due to our mask not being the same as the image
      return labelElement;
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_MaskedView.MaskedView, {
      maskElement: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: [styles.iconMaskContainer,
        // Extend the mask to the center of the screen so that label isn't clipped during animation
        screenLayout ? {
          minWidth: screenLayout.width / 2 - 27
        } : null],
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
          source: _backIconMask.default,
          resizeMode: "contain",
          style: [styles.iconMask, direction === 'rtl' && styles.flip]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.iconMaskFillerRect
        })]
      }),
      children: labelElement
    });
  };
  const handlePress = () => {
    if (onPress) {
      requestAnimationFrame(() => onPress());
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_HeaderButton.HeaderButton, {
    disabled: disabled,
    href: href,
    accessibilityLabel: accessibilityLabel,
    testID: testID,
    onPress: handlePress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    style: [styles.container, style],
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [renderBackImage(), renderLabel()]
    })
  });
}
const ICON_WIDTH = _reactNative.Platform.OS === 'ios' ? 13 : 24;
const ICON_MARGIN_END = _reactNative.Platform.OS === 'ios' ? 22 : 3;
const styles = _reactNative.StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    minWidth: _reactNative.StyleSheet.hairlineWidth,
    // Avoid collapsing when title is long
    ..._reactNative.Platform.select({
      ios: null,
      default: {
        marginVertical: 3,
        marginHorizontal: 11
      }
    })
  },
  label: {
    fontSize: 17,
    // Title and back label are a bit different width due to title being bold
    // Adjusting the letterSpacing makes them coincide better
    letterSpacing: 0.35
  },
  labelWrapper: {
    // These styles will make sure that the label doesn't fill the available space
    // Otherwise it messes with the measurement of the label
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginEnd: _HeaderIcon.ICON_MARGIN
  },
  icon: {
    width: ICON_WIDTH,
    marginEnd: ICON_MARGIN_END
  },
  iconWithLabel: _reactNative.Platform.OS === 'ios' ? {
    marginEnd: 6
  } : {},
  iconMaskContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  iconMaskFillerRect: {
    flex: 1,
    backgroundColor: '#000'
  },
  iconMask: {
    height: 21,
    width: 13,
    marginStart: -14.5,
    marginVertical: 12,
    alignSelf: 'center'
  },
  flip: {
    transform: 'scaleX(-1)'
  }
});
//# sourceMappingURL=HeaderBackButton.js.map