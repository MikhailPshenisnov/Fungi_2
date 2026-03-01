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
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.log('Token removed');
  } catch (error) {
    console.error('Error removing token:', error);
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
export const apiRequest = async (endpoint, options = {}) => {
  // Если skipAuth === true, не добавляем токен в заголовок
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

  // Добавляем токен только если не skipAuth и токен есть
  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const { skipAuth: _, ...cleanOptions } = options;  
  
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  console.log('Sending request to:', url);
  console.log('Request options:', { ...cleanOptions, headers });

  try {
    const response = await fetch(url, {
      ...cleanOptions,  
      headers,
      credentials: 'omit',
    });

    console.log('Response status:', response.status);
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Parsed data:', data);
    
    // Проверяем на пустой токен в ответе
    if (data?.data?.token === '') {
      console.log('Received empty token - clearing local storage');
      await removeToken();
    }
    
    if (!response.ok) {
      // Если 401 и это не skipAuth - токен недействителен
      if (response.status === 401 && !skipAuth) {
        await removeToken();
      }
      
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
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};