// clientAPI/auth.js
import { apiRequest, saveToken, parseJwt, removeToken } from './utils';

class AuthAPI {
  /**
   * Вход пользователя
   * @param {string} email - Email пользователя
   * @param {string} password - Пароль
   * @returns {Promise<Object>} - Данные пользователя из токена
   */
  async login(email, password) {
    console.log('AuthAPI.login called with:', { email, password: '***' });

    try {
      const response = await apiRequest('/Authorization/LoginUser', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // response должен содержать { token: "..." }
      if (response?.token) {
        // Сохраняем токен
        await saveToken(response.token);
        
        // Парсим токен для получения информации о пользователе
        const userData = parseJwt(response.token);
        
        // Возвращаем объединенные данные
        return {
          success: true,
          token: response.token,
          user: userData,
        };
      } else {
        throw new Error('Token not received from server');
      }
    } catch (error) {
      // Преобразуем ошибку в удобный формат
      console.error('AuthAPI.login error:', error);
      let errorMessage = 'Ошибка при входе';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Специфические ошибки авторизации
      if (errorMessage.includes('Invalid login or password')) {
        errorMessage = 'Неверный email или пароль';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Выход пользователя
   */
  async logout() {
    try {
     
      await apiRequest('/Authorization/LogoutUser', {
        method: 'POST',
      }).catch(() => {
        
      });
    } finally {
      
      await removeToken();
    }
  }

  /**
   * Получение текущего пользователя из сохраненного токена
   */
  async getCurrentUser() {
    try {
      // Можно также вызвать /Authorization/GetCurrentUserToken
      // или /Authorization/ValidateToken для проверки
      
      // Но проще просто распарсить сохраненный токен
      const token = await getToken(); // нужно импортировать getToken
      if (!token) return null;
      
      return parseJwt(token);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Проверка валидности токена (опционально)
   */
  async validateToken(token) {
    try {
      const response = await apiRequest('/Authorization/ValidateToken', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      
      return {
        success: true,
        data: response.tokenData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Создаем и экспортируем единственный экземпляр
export default new AuthAPI();