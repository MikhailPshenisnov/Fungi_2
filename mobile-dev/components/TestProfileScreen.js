import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AuthAPI } from '../clientAPI';

export default function TestProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    
    // Используем новый метод checkAuth
    const authenticated = await AuthAPI.checkAuth();
    
    console.log('Auth status:', authenticated);
    setIsAuthenticated(authenticated);
    setLoading(false);
    
    if (!authenticated) {
      Alert.alert(
        "Не авторизован",
        "Пожалуйста, войдите в систему",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login")
          }
        ]
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Выйти",
          onPress: async () => {
            await AuthAPI.logout();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const handleCheckToken = async () => {
    // Используем checkAuth для проверки
    const isAuth = await AuthAPI.checkAuth();
    
    Alert.alert(
      "Проверка авторизации",
      `Статус: ${isAuth ? 'авторизован' : 'не авторизован'}`
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F9A94A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тестовый профиль</Text>
      <Text style={styles.subtitle}>
        {isAuthenticated ? '✅ Вы авторизованы' : '❌ Вы не авторизованы'}
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Используется метод ValidateToken для проверки авторизации
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleCheckToken}
      >
        <Text style={styles.buttonText}>Проверить авторизацию</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, styles.logoutButtonText]}>
          ВЫЙТИ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
    color: '#323142',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Raleway-Regular',
    color: '#8E8E93',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    color: '#323142',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFE6C4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 24,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#323142',
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: '#FFE6C4',
    borderWidth: 2,
    borderColor: '#F9A94A',
  },
  logoutButtonText: {
    color: '#323142',
  },
});