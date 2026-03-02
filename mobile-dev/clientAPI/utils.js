// clientAPI/utils.js - исправленная версия

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from './config';

// Сохранение токена
export const saveToken = async (token) => {
  try {
    if (!token || token === '""' || token === '') {
      console.log('Attempted to save empty token');
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Получение токена
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && token !== '""' && token !== '') {
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Удаление токена
export const removeToken = async () => {
  try {
    console.log('🔴 [removeToken] ========== STARTING TOKEN REMOVAL ==========');
    
    // Проверяем, что есть в хранилище ДО удаления
    const beforeToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const beforeUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    console.log('🔴 [removeToken] Before removal - Token exists:', !!beforeToken);
    console.log('🔴 [removeToken] Before removal - Token value:', beforeToken ? beforeToken.substring(0, 20) + '...' : 'null');
    console.log('🔴 [removeToken] Before removal - User data exists:', !!beforeUser);
    
    // Удаляем
    console.log('🔴 [removeToken] Removing token...');
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Проверяем ПОСЛЕ удаления
    const afterToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const afterUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    console.log('🔴 [removeToken] After removal - Token exists:', !!afterToken);
    console.log('🔴 [removeToken] After removal - User data exists:', !!afterUser);
    
    if (!afterToken && !afterUser) {
      console.log('🔴 [removeToken] ✅ Token successfully removed from storage');
    } else {
      console.log('🔴 [removeToken] ❌ Token still exists in storage!');
    }
    
    console.log('🔴 [removeToken] ========== FINISHED ==========');
    
  } catch (error) {
    console.error('🔴 [removeToken] Error removing token:', error);
  }
};

// Парсинг JWT токена
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

// Обработка ответа от сервера
export const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    if (data.errorMessage) {
      throw {
        status: response.status,
        message: data.errorMessage.errorMessage || 'Unknown error',
        group: data.errorMessage.errorGroup,
      };
    }
    throw {
      status: response.status,
      message: `HTTP error ${response.status}`,
    };
  }
  
  return data.data;
};

// Базовый запрос с обработкой ошибок
// clientAPI/utils.js - исправленная версия apiRequest

export const apiRequest = async (endpoint, options = {}) => {
  const skipAuth = options.skipAuth || false;
  
  let token = null;
  if (!skipAuth) {
    token = await getToken();
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Adding token to headers:', token.substring(0, 20) + '...');
  }

  const { skipAuth: _, ...cleanOptions } = options;
  
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  console.log('Sending request to:', url);
  console.log('Headers:', headers);
  console.log('Body:', cleanOptions.body);

  try {
    const response = await fetch(url, {
      ...cleanOptions,
      headers,
      credentials: 'omit',
    });
    
    console.log('Response status:', response.status);
    
    const text = await response.text();
    console.log('Raw response:', text);

    // Если ответ пустой, но статус 200 - это нормально для некоторых эндпоинтов
    if (!text && response.status === 200) {
      console.log('Empty response received (expected for LogoutUser)');
      return null; // или пустой объект
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      // Для LogoutUser это ок, просто возвращаем null
      if (endpoint.includes('/LogoutUser')) {
        console.log('LogoutUser empty response handled');
        return null;
      }
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Parsed data:', data);
    
    if (!response.ok) {
      if (data.errorMessage) {
        throw {
          status: response.status,
          message: data.errorMessage.errorMessage || 'Unknown error',
          group: data.errorMessage.errorGroup,
        };
      }
      throw {
        status: response.status,
        message: `HTTP error ${response.status}`,
      };
    }
    
    // ВАЖНО: возвращаем data.data (именно такова структура ответа)
    return data.data;
    
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};