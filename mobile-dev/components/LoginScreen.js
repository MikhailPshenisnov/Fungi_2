// LoginScreen.js 
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AuthAPI } from "../clientAPI";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('1. handleLogin started');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Валидация
    if (!email.trim()) {
      Alert.alert("Ошибка", "Введите email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Ошибка", "Введите пароль");
      return;
    }

    setLoading(true);
    
    try {
      console.log('Calling AuthAPI.login...');
      const result = await AuthAPI.login(email, password);
      console.log('AuthAPI.login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to TestProfile');
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'TestProfile' }],
        });
      } else {
        console.log('Login failed:', result.error);
        Alert.alert("Ошибка входа", result.error);
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      Alert.alert("Ошибка", "Произошла непредвиденная ошибка");
    } finally {
      setLoading(false);
    }
  };

  // Динамические размеры
  const logoSize = screenWidth * 0.08; // 24% от ширины экрана
  const logoImageSize = logoSize * 0.70;
  const titleFontSize = screenWidth * 0.020;
  const appNameFontSize = screenWidth * 0.025;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: screenHeight * 0.05 }
        ]}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        {/* ЛОГО + НАЗВАНИЕ */}
        <View style={[styles.logoBlock, { marginBottom: screenHeight * 0.03 }]}>
          <View style={[styles.logoCircle, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
            <Image
              source={require("../assets/image/character.png")}
              style={[styles.logoImage, { width: logoImageSize, height: logoImageSize }]}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { fontSize: appNameFontSize, marginLeft: screenWidth * 0.01 }]}>
            Fungi
          </Text>
        </View>

        {/* ТЕКСТ "Войти в Fungi" */}
        <Text style={[styles.title, { fontSize: titleFontSize, marginBottom: screenHeight * 0.03 }]}>
          Войти в <Text style={styles.titleAccent}>Fungi</Text>
        </Text>

        {/* КНОПКИ GOOGLE / APPLE */}
        <View style={[styles.socialRow, { gap: screenWidth * 0.04, marginBottom: screenHeight * 0.01 }]}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/image/google.png")}
              style={styles.appIcons}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/image/apple.png")}
              style={styles.appIcons}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.orText, { marginTop: screenHeight * 0.015, marginBottom: screenHeight * 0.03 }]}>
          ИЛИ
        </Text>

        {/* EMAIL */}
        <View style={[styles.inputWrapper, { marginBottom: screenHeight * 0.015 }]}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#C2C3CB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* ПАРОЛЬ */}
        <View style={[styles.inputWrapper, { marginBottom: screenHeight * 0.015 }]}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="ПАРОЛЬ"
            placeholderTextColor="#C2C3CB"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            disabled={loading}
          >
            <Text style={styles.eyeText}>
              {showPassword ? "Скрыть" : "Показать"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ЗАБЫЛИ ПАРОЛЬ */}
        <TouchableOpacity 
          style={[styles.forgotWrapper, { marginBottom: screenHeight * 0.022 }]}
          onPress={() => navigation.navigate("ForgotPassword")}
          disabled={loading}
        >
          <Text style={styles.forgotText}>Забыли пароль?</Text>
        </TouchableOpacity>

        {/* КНОПКА "ВОЙТИ" */}
        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#323142" />
          ) : (
            <Text style={styles.primaryButtonText}>ВОЙТИ</Text>
          )}
        </TouchableOpacity>

        {/* "Ещё нет аккаунта? Создать" */}
        <View style={[styles.bottomRow, { marginBottom: screenHeight * 0.04 }]}>
          <Text style={styles.bottomText}>Ещё нет аккаунта? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Registration")}
            disabled={loading}
          >
            <Text style={styles.bottomLink}>Создать</Text>
          </TouchableOpacity>
        </View>

        {/* НИЖНИЙ ТЕКСТ */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Privacy Policy</Text>
          <Text style={styles.footerText}>Copyright 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  // ЛОГО БЛОК
  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    backgroundColor: "#FFE8C4",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    // размеры задаются динамически
  },
  appName: {
    fontFamily: "Raleway-Bold",
    color: "#323142",
  },

  appIcons: {
    width: 20,
    height: 20,
  },

  // ЗАГОЛОВОК
  title: {
    fontFamily: "Raleway-Medium",
    textAlign: "center",
    color: "#323142",
  },
  titleAccent: {
    color: "#F9A94A",
    fontFamily: "Raleway-Bold",
  },

  // СОЦКНОПКИ
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  orText: {
    textAlign: "center",
    fontFamily: "Raleway-Bold",
    fontSize: 12,
    color: "#005A6459",
  },

  // ИНПУТЫ
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontFamily: "Raleway-SemiBold",
    fontSize: 14,
    color: "#323142",
  },
  eyeButton: {
    paddingLeft: 8,
  },
  eyeText: {
    fontFamily: "Raleway-Medium",
    fontSize: 12,
    color: "#F9A94A",
  },

  forgotWrapper: {
    alignItems: "flex-end",
  },
  forgotText: {
    fontFamily: "Raleway-Medium",
    fontSize: 12,
    color: "#E6C49C",
    opacity: 0.7,
  },

  // КНОПКА ВОЙТИ
  primaryButton: {
    backgroundColor: "#FFE6C4",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontFamily: "Raleway-Bold",
    fontSize: 16,
    color: "#323142",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontFamily: "Raleway-Regular",
    fontSize: 13,
    color: "#8E8E93",
  },
  bottomLink: {
    fontFamily: "Raleway-Bold",
    fontSize: 13,
    color: "#E6C49C",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  footerText: {
    fontFamily: "Raleway-Regular",
    fontSize: 10,
    color: "#B0B0B5",
  },

  disabledButton: {
    opacity: 0.6,
  },
});