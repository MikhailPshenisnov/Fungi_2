import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";

export default function CustomSwitch() {
  const [enabled, setEnabled] = useState(false);
  const translateX = new Animated.Value(enabled ? 24 : 0);

  const toggle = () => {
    const toValue = enabled ? 0 : 24;

    Animated.timing(translateX, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setEnabled(!enabled);
  };

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
      <View
        style={[
          styles.track,
          { backgroundColor: enabled ? "#E8C9A1" : "#D9D9D9" },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
});