// RegistrationScreen.js
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
} from "react-native";
import { AuthAPI } from "../clientAPI";

export default function RegistrationScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

// RegistrationScreen.js - обновляем handleRegister

const handleRegister = async () => {
  console.log('1. handleRegister started');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Password:', password);
  
  // Только проверка на заполненность полей
  if (!name.trim()) {
    console.log('2. Name is empty');
    Alert.alert("Ошибка", "Введите имя");
    return;
  }
  if (!email.trim()) {
    console.log('2. Email is empty');
    Alert.alert("Ошибка", "Введите email");
    return;
  }
  if (!password.trim()) {
    console.log('2. Password is empty');
    Alert.alert("Ошибка", "Введите пароль");
    return;
  }

  console.log('3. Validation passed, setting loading to true');
  setLoading(true);
  
  try {
    console.log('4. Calling AuthAPI.register...');
    const result = await AuthAPI.register(name, email, password);
    console.log('5. AuthAPI.register result:', result);
    
    if (result.success) {
      console.log('6. Registration successful');
      Alert.alert(
        "Успех", 
        "Регистрация прошла успешно!",
        [
          { 
            text: "OK", 
            onPress: () => {
              console.log('7. Navigating to TestProfile');
              // Перенаправляем на тестовую страницу профиля
              navigation.navigate("TestProfile");
            } 
          }
        ]
      );
    } else {
      console.log('6. Registration failed:', result.error);
      Alert.alert("Ошибка регистрации", result.error);
    }
  } catch (error) {
    console.log('6. Unexpected error:', error);
    Alert.alert("Ошибка", "Произошла непредвиденная ошибка");
    console.error(error);
  } finally {
    console.log('7. Setting loading to false');
    setLoading(false);
  }
};

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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

        {/* ТЕКСТ "Регистрация в Fungi" */}
        <Text style={styles.title}>
          Регистрация в <Text style={styles.titleAccent}>Fungi</Text>
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

        {/* ИМЯ */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="ИМЯ"
            placeholderTextColor="#C2C3CB"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        {/* EMAIL */}
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
            editable={!loading}
          />
        </View>

        {/* ПАРОЛЬ */}
        <View style={styles.inputWrapper}>
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

        {/* УСЛОВИЯ ИСПОЛЬЗОВАНИЯ */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Регистрируясь, вы соглашаетесь с{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
            <Text style={styles.termsLink}>условиями использования</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> и </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Privacy")}>
            <Text style={styles.termsLink}>политикой конфиденциальности</Text>
          </TouchableOpacity>
        </View>

        {/* КНОПКА "ЗАРЕГИСТРИРОВАТЬСЯ" */}
        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#323142" />
          ) : (
            <Text style={styles.primaryButtonText}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
          )}
        </TouchableOpacity>

        {/* "Уже есть аккаунт? Войти" */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Уже есть аккаунт? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.bottomLink}>Войти</Text>
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

  // ЛОГО БЛОК — центр
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

  appIcons: {
    width: 20,
    height: 20,
  },

  // ЗАГОЛОВОК
  title: {
    fontFamily: "Raleway-Medium",
    fontSize: 20,
    textAlign: "center",
    color: "#323142",
    marginBottom: 24,
  },
  titleAccent: {
    color: "#F9A94A",
    fontFamily: "Raleway-Bold",
  },

  // СОЦКНОПКИ
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

  // ИНПУТЫ
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

  // УСЛОВИЯ ИСПОЛЬЗОВАНИЯ
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  termsText: {
    fontFamily: "Raleway-Regular",
    fontSize: 11,
    color: "#8E8E93",
    textAlign: "center",
  },
  termsLink: {
    fontFamily: "Raleway-Bold",
    fontSize: 11,
    color: "#E6C49C",
    textAlign: "center",
  },

  // КНОПКА РЕГИСТРАЦИИ — персиковая с тенью
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
    fontFamily: "Raleway-Regular",
    fontSize: 10,
    color: "#B0B0B5",
  },
});