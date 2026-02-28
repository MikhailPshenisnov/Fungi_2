// clientAPI/config.js
export const API_CONFIG = {
  // Замените на реальный URL вашего сервера
  // Для эмулятора Android: http://10.0.2.2:5000
  // Для iOS симулятора: http://localhost:5000
  // Для реального устройства: http://<IP-вашего-компьютера>:5000
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 секунд
};

// Ключи для AsyncStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
};