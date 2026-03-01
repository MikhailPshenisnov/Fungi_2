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
  async validateToken(token = null) {
    try {
      // Если токен не передан, берем из хранилища
      const tokenToValidate = token || await getToken();
      
      if (!tokenToValidate) {
        return {
          success: false,
          error: 'Токен отсутствует',
          data: null,
        };
      }

      const response = await apiRequest('/Authorization/ValidateToken', {
        method: 'POST',
        body: JSON.stringify({ token: tokenToValidate }),
        // Важно: не добавляем Authorization header, т.к. токен в body
        skipAuth: true, // Специальный флаг для apiRequest
      });

      return {
        success: true,
        data: response?.tokenData || null,
        token: response?.token || null,
      };
    } catch (error) {
      console.error('Validate token error:', error);
      
      // Если ошибка 401 - токен недействителен
      if (error.status === 401) {
        await removeToken(); // Очищаем недействительный токен
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
    console.log('Calling getCurrentUserToken');
    const response = await apiRequest('/Authorization/GetCurrentUserToken', {
      method: 'GET',
    });

    console.log('getCurrentUserToken response:', response);
    
    return {
      success: true,
      token: response?.token || null,
    };
  } catch (error) {
    console.error('Get current user token error:', error);
    
    if (error.status === 401) {
      await removeToken();
    }
    
    return {
      success: false,
      error: error.message || 'Ошибка получения токена',
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
  try {
    console.log('Logout started');
    
    const response = await apiRequest('/Authorization/LogoutUser', {
      method: 'POST',
      skipAuth: true,
    }).catch(error => {
      console.log('Logout server error (ignored):', error);
    });
    
    console.log('Logout server response:', response);
    
  } catch (error) {
    console.log('Logout outer error:', error);
   
  } finally {
   //ВСЕГДА очищаем локальные данные, независимо от ответа сервера
    console.log('Clearing local token');
    await removeToken();
    console.log('Token cleared');
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
    const token = await getToken();
    if (!token) return false;
    
    try {
    
      const result = await this.validateToken(token);
      return result.success;
    } catch {
      return false;
    }
  }
  }




export default new AuthAPI();