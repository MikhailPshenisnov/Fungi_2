import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_BOTTOM_GAP = 12;
export const TAB_BAR_BASE_HEIGHT = 76;
export const TAB_BAR_SCREEN_PADDING = 96;

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index];

  if (currentRoute.name === "Камера") {
    return null;
  }

  const visibleRoutes = state.routes.filter((route) => route.name !== "Камера");
  const leftRoutes = visibleRoutes.slice(0, 2);
  const rightRoutes = visibleRoutes.slice(2);
  const bottomInset = Math.max(insets.bottom, TAB_BAR_BOTTOM_GAP);

  const renderTabButton = (route) => {
    const routeIndex = state.routes.findIndex((item) => item.key === route.key);
    const { options } = descriptors[route.key];
    const isFocused = state.index === routeIndex;

    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tabButton}
        activeOpacity={0.85}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {options.tabBarIcon({ focused: isFocused, size: 26 })}
      </TouchableOpacity>
    );
  };

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={[styles.tabbar, { paddingBottom: bottomInset }]}> 
        <Image
          source={require("../assets/image/navbar/Subtract.png")}
          style={[styles.subtractImage, { bottom: bottomInset }]}
          pointerEvents="none"
        />

        <View style={styles.row}>
          <View style={styles.sideGroup}>{leftRoutes.map(renderTabButton)}</View>
          <View style={styles.centerSpacer} />
          <View style={styles.sideGroup}>{rightRoutes.map(renderTabButton)}</View>
        </View>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate("Камера")}
          activeOpacity={0.9}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../assets/image/navbar/camera.svg")}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 24,
    paddingHorizontal: 16,
  },
  tabbar: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    minHeight: TAB_BAR_BASE_HEIGHT,
    justifyContent: "flex-end",
    position: "relative",
  },
  subtractImage: {
    position: "absolute",
    left: 0,
    right: 0,
    width: "100%",
    height: 58,
    resizeMode: "stretch",
  },
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  sideGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  centerSpacer: {
    width: 82,
  },
  tabButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    alignSelf: "center",
    top: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    elevation: 26,
  },
  cameraIcon: {
    width: 54,
    height: 54,
  },
});
