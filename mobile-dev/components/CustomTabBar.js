import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }) {
  // Скрываем таб-бар на экране камеры
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === "Камера") {
    return null;
  }

  // Немного увеличил ширину (было 353, стало 380)
  const tabbarWidth = Math.min(380, screenWidth - 40); // Не больше 380, но с отступами
  const cameraButtonLeft = (tabbarWidth / 2) - 27;
  const subtractImageTop = 20;
  
  // Позиционирование кнопок (скорректировал проценты под новую ширину)
  const buttonPositions = {
    "Главная": { leftPercent: 0.08, top: 35 },      // ~30px
    "Карточки": { leftPercent: 0.22, top: 36 },     // ~84px
    "Энциклопедия": { leftPercent: 0.71, top: 34 },  // ~270px
    "Профиль": { leftPercent: 0.85, top: 34 },       // ~323px
  };

  return (
    <View style={[styles.tabbar, { width: tabbarWidth }]}>
      {/* Фоновое изображение таб-бара */}
      <Image
        source={require("../assets/image/navbar/Subtract.png")}
        style={[
          styles.subtractImage, 
          { 
            width: tabbarWidth, 
            top: subtractImageTop 
          }
        ]}
        resizeMode="stretch"
      />

      {/* Кнопка камеры по центру */}
      <TouchableOpacity
        style={[styles.cameraButton, { left: cameraButtonLeft }]}
        onPress={() => navigation.navigate("Камера")}
      >
        <Image
          source={require("../assets/image/navbar/camera.svg")}
          style={{ width: 54, height: 54 }}
        />
      </TouchableOpacity>

      {/* Обычные табы */}
      {state.routes.map((route, index) => {
        if (route.name === "Камера") return null;

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        const position = buttonPositions[route.name];
        if (!position) return null;
        
        const leftPosition = tabbarWidth * position.leftPercent;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabButton, { left: leftPosition, top: position.top }]}
          >
            {options.tabBarIcon({ focused: isFocused, size: 26 })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    height: 77,
    position: "absolute",
    bottom: 20,
    left: (screenWidth - 380) / 2, // Центрируем на экране
    // Если ширина меньше 380, то просто ставим отступ 20
  },

  subtractImage: {
    position: "absolute",
    height: 57,
    resizeMode: "stretch",
  },

  cameraButton: {
    position: "absolute",
    width: 54,
    height: 54,
    top: 0,
    zIndex: 10,
  },

  tabButton: {
    position: "absolute",
  },
});