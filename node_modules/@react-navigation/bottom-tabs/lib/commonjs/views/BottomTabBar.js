"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomTabBar = BottomTabBar;
exports.getTabBarHeight = void 0;
var _elements = require("@react-navigation/elements");
var _native = require("@react-navigation/native");
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _BottomTabBarHeightCallbackContext = require("../utils/BottomTabBarHeightCallbackContext.js");
var _useIsKeyboardShown = require("../utils/useIsKeyboardShown.js");
var _BottomTabItem = require("./BottomTabItem.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TABBAR_HEIGHT_UIKIT = 49;
const TABBAR_HEIGHT_UIKIT_COMPACT = 32;
const SPACING_UIKIT = 15;
const SPACING_MATERIAL = 12;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const useNativeDriver = _reactNative.Platform.OS !== 'web';
const shouldUseHorizontalLabels = ({
  state,
  descriptors,
  dimensions
}) => {
  const {
    tabBarLabelPosition
  } = descriptors[state.routes[state.index].key].options;
  if (tabBarLabelPosition) {
    switch (tabBarLabelPosition) {
      case 'beside-icon':
        return true;
      case 'below-icon':
        return false;
    }
  }
  if (dimensions.width >= 768) {
    // Screen size matches a tablet
    const maxTabWidth = state.routes.reduce((acc, route) => {
      const {
        tabBarItemStyle
      } = descriptors[route.key].options;
      const flattenedStyle = _reactNative.StyleSheet.flatten(tabBarItemStyle);
      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          return acc + flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          return acc + flattenedStyle.maxWidth;
        }
      }
      return acc + DEFAULT_MAX_TAB_ITEM_WIDTH;
    }, 0);
    return maxTabWidth <= dimensions.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};
const isCompact = ({
  state,
  descriptors,
  dimensions
}) => {
  const {
    tabBarPosition,
    tabBarVariant
  } = descriptors[state.routes[state.index].key].options;
  if (tabBarPosition === 'left' || tabBarPosition === 'right' || tabBarVariant === 'material') {
    return false;
  }
  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions
  });
  if (_reactNative.Platform.OS === 'ios' && !_reactNative.Platform.isPad && isLandscape && horizontalLabels) {
    return true;
  }
  return false;
};
const getTabBarHeight = ({
  state,
  descriptors,
  dimensions,
  insets,
  style
}) => {
  const {
    tabBarPosition
  } = descriptors[state.routes[state.index].key].options;
  const flattenedStyle = _reactNative.StyleSheet.flatten(style);
  const customHeight = flattenedStyle && 'height' in flattenedStyle ? flattenedStyle.height : undefined;
  if (typeof customHeight === 'number') {
    return customHeight;
  }
  const inset = insets[tabBarPosition === 'top' ? 'top' : 'bottom'];
  if (isCompact({
    state,
    descriptors,
    dimensions
  })) {
    return TABBAR_HEIGHT_UIKIT_COMPACT + inset;
  }
  return TABBAR_HEIGHT_UIKIT + inset;
};
exports.getTabBarHeight = getTabBarHeight;
function BottomTabBar({
  state,
  navigation,
  descriptors,
  insets,
  style
}) {
  const {
    colors
  } = (0, _native.useTheme)();
  const {
    direction
  } = (0, _native.useLocale)();
  const {
    buildHref
  } = (0, _native.useLinkBuilder)();
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const {
    tabBarPosition = 'bottom',
    tabBarShowLabel,
    tabBarLabelPosition,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarVariant = 'uikit',
    tabBarStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor
  } = focusedOptions;
  if (tabBarVariant === 'material' && tabBarPosition !== 'left' && tabBarPosition !== 'right') {
    throw new Error("The 'material' variant for tab bar is only supported when 'tabBarPosition' is set to 'left' or 'right'.");
  }
  if (tabBarLabelPosition === 'below-icon' && tabBarVariant === 'uikit' && (tabBarPosition === 'left' || tabBarPosition === 'right')) {
    throw new Error("The 'below-icon' label position for tab bar is only supported when 'tabBarPosition' is set to 'top' or 'bottom' when using the 'uikit' variant.");
  }
  const dimensions = (0, _reactNativeSafeAreaContext.useSafeAreaFrame)();
  const isKeyboardShown = (0, _useIsKeyboardShown.useIsKeyboardShown)();
  const onHeightChange = _react.default.useContext(_BottomTabBarHeightCallbackContext.BottomTabBarHeightCallbackContext);
  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);
  const visibilityAnimationConfigRef = _react.default.useRef(tabBarVisibilityAnimationConfig);
  _react.default.useEffect(() => {
    visibilityAnimationConfigRef.current = tabBarVisibilityAnimationConfig;
  });
  const [isTabBarHidden, setIsTabBarHidden] = _react.default.useState(!shouldShowTabBar);
  const [visible] = _react.default.useState(() => new _reactNative.Animated.Value(shouldShowTabBar ? 1 : 0));
  _react.default.useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;
    if (shouldShowTabBar) {
      const animation = visibilityAnimationConfig?.show?.animation === 'spring' ? _reactNative.Animated.spring : _reactNative.Animated.timing;
      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...visibilityAnimationConfig?.show?.config
      }).start(({
        finished
      }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setIsTabBarHidden(true);
      const animation = visibilityAnimationConfig?.hide?.animation === 'spring' ? _reactNative.Animated.spring : _reactNative.Animated.timing;
      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...visibilityAnimationConfig?.hide?.config
      }).start();
    }
    return () => visible.stopAnimation();
  }, [visible, shouldShowTabBar]);
  const [layout, setLayout] = _react.default.useState({
    height: 0
  });
  const handleLayout = e => {
    const {
      height
    } = e.nativeEvent.layout;
    onHeightChange?.(height);
    setLayout(layout => {
      if (height === layout.height) {
        return layout;
      } else {
        return {
          height
        };
      }
    });
  };
  const {
    routes
  } = state;
  const tabBarHeight = getTabBarHeight({
    state,
    descriptors,
    insets,
    dimensions,
    style: [tabBarStyle, style]
  });
  const hasHorizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions
  });
  const compact = isCompact({
    state,
    descriptors,
    dimensions
  });
  const sidebar = tabBarPosition === 'left' || tabBarPosition === 'right';
  const spacing = tabBarVariant === 'material' ? SPACING_MATERIAL : SPACING_UIKIT;
  const tabBarBackgroundElement = tabBarBackground?.();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Animated.View, {
    style: [tabBarPosition === 'left' ? styles.start : tabBarPosition === 'right' ? styles.end : styles.bottom, (_reactNative.Platform.OS === 'web' ? tabBarPosition === 'right' : direction === 'rtl' && tabBarPosition === 'left' || direction !== 'rtl' && tabBarPosition === 'right') ? {
      borderLeftWidth: _reactNative.StyleSheet.hairlineWidth
    } : (_reactNative.Platform.OS === 'web' ? tabBarPosition === 'left' : direction === 'rtl' && tabBarPosition === 'right' || direction !== 'rtl' && tabBarPosition === 'left') ? {
      borderRightWidth: _reactNative.StyleSheet.hairlineWidth
    } : tabBarPosition === 'top' ? {
      borderBottomWidth: _reactNative.StyleSheet.hairlineWidth
    } : {
      borderTopWidth: _reactNative.StyleSheet.hairlineWidth
    }, {
      backgroundColor: tabBarBackgroundElement != null ? 'transparent' : colors.card,
      borderColor: colors.border
    }, sidebar ? {
      paddingTop: (hasHorizontalLabels ? spacing : spacing / 2) + insets.top,
      paddingBottom: (hasHorizontalLabels ? spacing : spacing / 2) + insets.bottom,
      paddingStart: spacing + (tabBarPosition === 'left' ? insets.left : 0),
      paddingEnd: spacing + (tabBarPosition === 'right' ? insets.right : 0),
      minWidth: hasHorizontalLabels ? (0, _elements.getDefaultSidebarWidth)(dimensions) : 0
    } : [{
      transform: [{
        translateY: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [layout.height + insets[tabBarPosition === 'top' ? 'top' : 'bottom'] + _reactNative.StyleSheet.hairlineWidth, 0]
        })
      }],
      // Absolutely position the tab bar so that the content is below it
      // This is needed to avoid gap at bottom when the tab bar is hidden
      position: isTabBarHidden ? 'absolute' : undefined
    }, {
      height: tabBarHeight,
      paddingBottom: tabBarPosition === 'bottom' ? insets.bottom : 0,
      paddingTop: tabBarPosition === 'top' ? insets.top : 0,
      paddingHorizontal: Math.max(insets.left, insets.right)
    }], tabBarStyle],
    pointerEvents: isTabBarHidden ? 'none' : 'auto',
    onLayout: sidebar ? undefined : handleLayout,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      pointerEvents: "none",
      style: _reactNative.StyleSheet.absoluteFill,
      children: tabBarBackgroundElement
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      accessibilityRole: "tablist",
      style: sidebar ? styles.sideContent : styles.bottomContent,
      children: routes.map((route, index) => {
        const focused = index === state.index;
        const {
          options
        } = descriptors[route.key];
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });
          if (!focused && !event.defaultPrevented) {
            navigation.dispatch({
              ..._native.CommonActions.navigate(route),
              target: state.key
            });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };
        const label = typeof options.tabBarLabel === 'function' ? options.tabBarLabel : (0, _elements.getLabel)({
          label: options.tabBarLabel,
          title: options.title
        }, route.name);
        const accessibilityLabel = options.tabBarAccessibilityLabel !== undefined ? options.tabBarAccessibilityLabel : typeof label === 'string' && _reactNative.Platform.OS === 'ios' ? `${label}, tab, ${index + 1} of ${routes.length}` : undefined;
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_native.NavigationContext.Provider, {
          value: descriptors[route.key].navigation,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_native.NavigationRouteContext.Provider, {
            value: route,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomTabItem.BottomTabItem, {
              href: buildHref(route.name, route.params),
              route: route,
              descriptor: descriptors[route.key],
              focused: focused,
              horizontal: hasHorizontalLabels,
              compact: compact,
              sidebar: sidebar,
              variant: tabBarVariant,
              onPress: onPress,
              onLongPress: onLongPress,
              accessibilityLabel: accessibilityLabel,
              testID: options.tabBarButtonTestID,
              allowFontScaling: options.tabBarAllowFontScaling,
              activeTintColor: tabBarActiveTintColor,
              inactiveTintColor: tabBarInactiveTintColor,
              activeBackgroundColor: tabBarActiveBackgroundColor,
              inactiveBackgroundColor: tabBarInactiveBackgroundColor,
              button: options.tabBarButton,
              icon: options.tabBarIcon ?? (({
                color,
                size
              }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_elements.MissingIcon, {
                color: color,
                size: size
              })),
              badge: options.tabBarBadge,
              badgeStyle: options.tabBarBadgeStyle,
              label: label,
              showLabel: tabBarShowLabel,
              labelStyle: options.tabBarLabelStyle,
              iconStyle: options.tabBarIconStyle,
              style: [sidebar ? {
                marginVertical: hasHorizontalLabels ? tabBarVariant === 'material' ? 0 : 1 : spacing / 2
              } : styles.bottomItem, options.tabBarItemStyle]
            })
          })
        }, route.key);
      })
    })]
  });
}
const styles = _reactNative.StyleSheet.create({
  start: {
    top: 0,
    bottom: 0,
    start: 0
  },
  end: {
    top: 0,
    bottom: 0,
    end: 0
  },
  bottom: {
    start: 0,
    end: 0,
    bottom: 0,
    elevation: 8
  },
  bottomContent: {
    flex: 1,
    flexDirection: 'row'
  },
  sideContent: {
    flex: 1,
    flexDirection: 'column'
  },
  bottomItem: {
    flex: 1
  }
});
//# sourceMappingURL=BottomTabBar.js.map