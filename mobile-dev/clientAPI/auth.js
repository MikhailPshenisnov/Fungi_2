// clientAPI/auth.js
import { apiRequest, saveToken, removeToken, getToken } from './utils';

class AuthAPI {
  /**
   * Вход пользователя
   * @param {string} email - Email пользователя
   * @param {string} password - Пароль
   */
  async login(email, password) {
    try {
      const response = await apiRequest('/Authorization/LoginUser', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipAuth: true, // Логин всегда публичный
      });

      if (response?.token) {
        await saveToken(response.token);
        return {
          success: true,
          token: response.token,
        };
      }
      
      throw new Error('Token not received');
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при входе',
      };
    }
  }

  /**
   * Регистрация пользователя
   * @param {object} userData - Данные пользователя { name, email, password }
   */
  async register(userData) {
    try {
      const response = await apiRequest('/Authorization/RegisterUser', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response?.token) {
        await saveToken(response.token);
        return {
          success: true,
          token: response.token,
        };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при регистрации',
      };
    }
  }

  /**
   * Валидация токена и получение данных пользователя
   * POST /Authorization/ValidateToken
   * @param {string} token 
   */
  async validateToken() {
    try {
      const token = await getToken();
      
      if (!token) {
        return {
          success: false,
          error: 'Токен отсутствует',
          data: null,
        };
      }

      // skipAuth: false - чтобы apiRequest добавил токен в заголовок
      const response = await apiRequest('/Authorization/ValidateToken', {
        method: 'POST',
        skipAuth: false, // Важно! НЕ skipAuth, чтобы токен попал в заголовок
        // body больше не нужен!
      });

      return {
        success: true,
        data: response?.tokenData || null,
        token: response?.token || null,
      };
      
    } catch (error) {
      console.error('Validate token error:', error);
      
      if (error.status === 401) {
        await removeToken();
      }
      
      return {
        success: false,
        error: error.message || 'Ошибка валидации токена',
        data: null,
      };
    }
  }


  /**
   * Получение текущего токена пользователя
   * GET /Authorization/GetCurrentUserToken
   */
  async getCurrentUserToken() {
    try {
      // Теперь этот метод тоже требует авторизацию
      const response = await apiRequest('/Authorization/GetCurrentUserToken', {
        method: 'GET',
        skipAuth: false, // Токен в заголовке
      });

      return {
        success: true,
        token: response?.token || null,
      };
      
    } catch (error) {
      console.error('Get token error:', error);
      return {
        success: false,
        error: error.message,
        token: null,
      };
    }
  }

  /**
   * Получение данных текущего пользователя (обертка над validateToken)
   * Удобный метод для использования в приложении
   */
  async getCurrentUser() {
    const result = await this.validateToken();
    return result.success ? result.data : null;
  }

  /**
   * Проверка, авторизован ли пользователь (быстрая, без запроса к серверу)
   */
  async isAuthenticated() {
    const token = await getToken();
    return !!token;
  }

async logout() {
  console.log('🟡 [AuthAPI.logout] ========== STARTING LOGOUT ==========');
  
  try {
    // Проверим токен до выхода
    const tokenBefore = await getToken();
    console.log('🟡 [AuthAPI.logout] Token before logout:', tokenBefore ? 'exists' : 'none');
    
    // Попробуем уведомить сервер
    console.log('🟡 [AuthAPI.logout] Calling LogoutUser endpoint...');
    try {
      await apiRequest('/Authorization/LogoutUser', {
        method: 'POST',
        skipAuth: true,
      });
      console.log('🟡 [AuthAPI.logout] LogoutUser endpoint success');
    } catch (serverError) {
      console.log('🟡 [AuthAPI.logout] LogoutUser endpoint error (ignored):', serverError.message);
    }
    
    // Удаляем токен локально
    console.log('🟡 [AuthAPI.logout] Calling removeToken...');
    await removeToken();
    
    // Проверим, что токен действительно удалился
    const tokenAfter = await getToken();
    console.log('🟡 [AuthAPI.logout] Token after logout:', tokenAfter ? 'still exists!' : 'none - ✅ good');
    
    console.log('🟡 [AuthAPI.logout] ========== LOGOUT COMPLETED ==========');
    
  } catch (error) {
    console.error('🟡 [AuthAPI.logout] Error during logout:', error);
  }
}

/**
 * Регистрация пользователя
 * @param {string} name - Имя пользователя (только латиница)
 * @param {string} email - Email
 * @param {string} password - Пароль
 */
async register(name, email, password) {
  console.log('AuthAPI.register called with:', { name, email, password: '***' });
  
  try {
    // Отправляем запрос на сервер без клиентских проверок
    const response = await apiRequest('/Authorization/RegisterUser', {
      method: 'POST',
      body: JSON.stringify({ 
        name,      // name, не username!
        email, 
        password 
      }),
    });

    console.log('AuthAPI.register response:', response);

    // Если получили токен - сохраняем и возвращаем успех
    if (response?.token) {
      await saveToken(response.token);
      
      // Опционально: можем получить данные пользователя через validateToken
      // Но для быстрого ответа просто вернем успех
      return {
        success: true,
        token: response.token,
        // user: userData  // можно добавить позже если нужно
      };
    }
    
    throw new Error('Token not received from server');
    
  } catch (error) {
    console.error('AuthAPI.register error:', error);
    
    if (error.message) {
      return {
        success: false,
        error: error.message, 
      };
    }
  
    return {
      success: false,
      error: 'Ошибка при регистрации. Попробуйте позже.',
    };
  }
}

  async checkAuth() {
    try {
      const result = await this.validateToken();
      return result.success;
    } catch {
      return false;
    }
  }
  }




export default new AuthAPI();