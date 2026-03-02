import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }) {
return ( <View style={styles.tabbar}>
{/* Фоновое изображение таб-бара */}
<Image
source={require("../assets/image/navbar/Subtract.png")}
style={styles.subtractImage}
/>


  {/* Кнопка камеры по центру */}
  <TouchableOpacity
    style={styles.cameraButton}
    onPress={() => navigation.navigate("Камера")}
  >
    <Image
      source={require("../assets/image/navbar/camera.svg")}
      style={{ width: 54, height: 54 }}
    />
  </TouchableOpacity>

  {/* Обычные табы */}
  {state.routes.map((route, index) => {
    if (route.name === "Камера") return null; // Камера отдельная

    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    let left = 0;
    let top = 0;

    // Расположение кнопок по твоему макету
    switch (route.name) {
      case "Главная":
        left = 30;
        top = 35;
        break;
      case "Карточки":
        left = 84;
        top = 36;
        break;
      case "Энциклопедия":
        left = 240;
        top = 34;
        break;
      case "Профиль":
        left = 297;
        top = 34;
        break;
    }

    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        style={[styles.tabButton, { left, top }]}
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
width: 353,
height: 77,
position: "absolute",
bottom: 20,
left: 20,
},

subtractImage: {
width: 353,
height: 57,
position: "absolute",
top: 20,
left: 0,
resizeMode: "stretch",
},

cameraButton: {
position: "absolute",
width: 54,
height: 54,
top: 0,
left: 149,
zIndex: 10,
},

tabButton: {
position: "absolute",
},
});
