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
} from "react-native";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Ошибка", "Пожалуйста, введите email");
      return;
    }
    
    Alert.alert(
      "Письмо отправлено",
      `Инструкции отправлены на ${email}`,
      [{ text: "OK", onPress: () => navigation.navigate("Login") }]
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* КНОПКА НАЗАД */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>

        {/* ЛОГО + НАЗВАНИЕ */}
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

        {/* ЗАГОЛОВОК */}
        <Text style={styles.title}>
          Восстановление пароля
        </Text>

        {/* ОПИСАНИЕ */}
        <Text style={styles.orText}>Введите свою почту</Text>

        {/* EMAIL ПОЛЕ */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#C2C3CB"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* КНОПКА ОТПРАВИТЬ */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleResetPassword}
        >
          <Text style={styles.primaryButtonText}>Восстановить</Text>
        </TouchableOpacity>

        {/* ССЫЛКА НА ЛОГИН */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Вспомнили пароль? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.bottomLink}>Войти</Text>
          </TouchableOpacity>
        </View>

        {/* ФУТЕР */}
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
  orText: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 24,           // больше воздуха до EMAIL
    fontFamily: "Raleway-Bold",
    fontSize: 16,
    color: "#005A6459",           // синеватый
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
    paddingBottom: 100,
    minHeight: '100%',
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  backButtonText: {
    fontFamily: "Raleway-SemiBold",
    fontSize: 14,
    color: "#F9A94A",
  },
  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
  title: {
    fontFamily: "Raleway-Bold",
    fontSize: 24,
    textAlign: "center",
    color: "#323142",
    marginBottom: 8,
  },
  titleAccent: {
    color: "#F9A94A",
    fontFamily: "Raleway-Bold",
  },
  description: {
    fontFamily: "Raleway-Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#8E8E93",
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
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
  primaryButton: {
    backgroundColor: "#FFE6C4",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
  footerContainer: {
    position: 'absolute',
    bottom: 30, // Отступ от низа
    left: 24,
    right: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontFamily: "Raleway-Regular",
    fontSize: 10,
    color: "#B0B0B5",
  },
});