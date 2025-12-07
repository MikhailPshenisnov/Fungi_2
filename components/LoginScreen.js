import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ЛОГО + НАЗВАНИЕ (центр) */}
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../assets/image/character.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Fungi</Text>
        </View>

        {/* ТЕКСТ "Войти в Fungi" */}
        <Text style={styles.title}>
          Войти в <Text style={styles.titleAccent}>Fungi</Text>
        </Text>

        {/* КНОПКИ GOOGLE / APPLE */}
        <View style={styles.socialRow}>
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

        <Text style={styles.orText}>ИЛИ</Text>

        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/image/mail.png")}
            style={styles.inputIconImage}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#C4C4C4"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/image/lock.png")}
            style={styles.inputIconImage}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="ПАРОЛЬ"
            placeholderTextColor="#C4C4C4"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {showPassword ? "Скрыть" : "Показать"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ЗАБЫЛИ ПАРОЛЬ */}
        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Забыли пароль?</Text>
        </TouchableOpacity>

        {/* КНОПКА "ВОЙТИ" */}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>ВОЙТИ</Text>
        </TouchableOpacity>

        {/* "Ещё нет аккаунта? Создать" */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Ещё нет аккаунта? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
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
    paddingTop: 40,
    paddingBottom: 120,
  },
  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
    inputIconImage: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#C4C4C4",
  },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FFE8C4",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  appName: {
    fontFamily: "Raleway-Bold",
    fontSize: 32,
    color: "#323142",
    marginLeft: 16,
  },
  appIcons: {
    width: 20,
    height: 20,
  },
  title: {
    fontFamily: "Raleway-Bold",
    fontSize: 24,
    textAlign: "center",
    color: "#323142",
    marginBottom: 24,
  },
  titleAccent: {
    color: "#F9A94A",
    fontFamily: "Raleway-Bold",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
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
    marginTop: 12,
    marginBottom: 24,
    fontFamily: "Raleway-Bold",
    fontSize: 12,
    color: "#005A6459",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
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
    marginBottom: 18,
  },
  forgotText: {
    fontFamily: "Raleway-Medium",
    fontSize: 12,
    color: "#E6C49C",
    opacity: 0.7,
  },
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
    marginBottom: 32,
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
    fontFamily: "Raleway-Medium",
    fontSize: 12,
    color: "#718096",
  },
});