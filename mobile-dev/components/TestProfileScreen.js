// TestProfileScreen.js - исправленная версия

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AuthAPI } from '../clientAPI';

export default function TestProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    
    // Проверяем авторизацию
    const user = await AuthAPI.getCurrentUser();
    console.log('Current user:', user);
    
    if (!user) {
      // Если не авторизован - сразу на логин
      console.log('Not authenticated, redirecting to Login');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }
    
    setUserData(user);
    setLoading(false);
  };

  const handleLogout = async () => {
  console.log('🔵 [TestProfile] ========== HANDLE LOGOUT CALLED ==========');
  
  // Сначала проверим, есть ли токен
  const tokenCheck = await AuthAPI.getCurrentUserToken();
  console.log('🔵 [TestProfile] Token before logout:', tokenCheck.token ? 'exists' : 'none');
  
  setLoading(true);
  
  try {
    console.log('🔵 [TestProfile] Calling AuthAPI.logout...');
    await AuthAPI.logout();
    console.log('🔵 [TestProfile] AuthAPI.logout completed');
    
    // Проверим, что токен действительно удалился
    const tokenAfter = await AuthAPI.getCurrentUserToken();
    console.log('🔵 [TestProfile] Token after logout:', tokenAfter.token ? 'STILL EXISTS!' : 'none - ✅');
    
    console.log('🔵 [TestProfile] Navigating to Login...');
    
    // Небольшая задержка чтобы увидеть логи
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 1000);
    
  } catch (error) {
    console.error('🔵 [TestProfile] Logout error:', error);
    Alert.alert('Ошибка', 'Не удалось выйти');
    setLoading(false);
  }
};
  const handleCheckToken = async () => {
    const user = await AuthAPI.getCurrentUser();
    const token = await AuthAPI.getCurrentUserToken();
    
    Alert.alert(
      "Информация",
      `Авторизация: ${user ? '✅' : '❌'}\n` +
      `Токен: ${token.token ? 'есть' : 'нет'}\n` +
      (user ? `Пользователь: ${user.name || user.Name}` : '')
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
        {userData ? '✅ Вы авторизованы' : '❌ Вы не авторизованы'}
      </Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {userData 
            ? `Имя: ${userData.name || userData.Name}\nEmail: ${userData.email || userData.Email}`
            : 'Данные пользователя не загружены'}
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