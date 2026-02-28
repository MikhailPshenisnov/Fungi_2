// clientAPI/utils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from './config';
import { Alert } from 'react-native';

// Сохранение токена
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Получение токена
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Удаление токена (при выходе)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Парсинг JWT токена для получения информации о пользователе
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
    // Если сервер вернул ошибку в формате { errorMessage: {...} }
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
  
  return data.data; // Возвращаем только поле data
};

// Базовый запрос с обработкой ошибок
// clientAPI/utils.js - обновите функцию apiRequest

export const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_CONFIG.baseURL}${endpoint}`;
  console.log('Sending request to:', url);
  console.log('Request options:', { ...options, headers });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Добавим credentials для работы с куками, если нужны
      credentials: 'omit', // или 'include' если нужны куки
    });

    console.log('Response status:', response.status);
    
    // Проверяем, есть ли ответ
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
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};