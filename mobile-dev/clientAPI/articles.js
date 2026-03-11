import { apiRequest } from './utils';

class ArticlesAPI {
  /**
   * Получение статьи по ID
   * @param {string} articleId
   */
  async getArticle(articleId) {
    try {
      const response = await apiRequest(`/Articles/GetArticle?articleId=${encodeURIComponent(articleId)}`, {
        method: 'GET',
        skipAuth: true,
      });

      return {
        success: true,
        data: response?.article || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при получении статьи',
        data: null,
      };
    }
  }

  /**
   * Получение списка статей с фильтрами
   * @param {object} filters
   */
  async getFilteredArticles(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.partOfTitle) {
        params.append('partOfTitle', filters.partOfTitle);
      }

      if (filters.publishDateFrom) {
        params.append('publishDateFrom', filters.publishDateFrom);
      }

      if (filters.publishDateTo) {
        params.append('publishDateTo', filters.publishDateTo);
      }

      if (filters.partOfAuthorString) {
        params.append('partOfAuthorString', filters.partOfAuthorString);
      }

      const query = params.toString();
      const endpoint = query
        ? `/Articles/GetFilteredArticles?${query}`
        : '/Articles/GetFilteredArticles';

      const response = await apiRequest(endpoint, {
        method: 'GET',
        skipAuth: true,
      });

      return {
        success: true,
        data: response?.articles || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при получении списка статей',
        data: [],
      };
    }
  }

  /**
   * Создание статьи
   * @param {object} payload
   */
  async createArticle(payload) {
    try {
      const response = await apiRequest('/Articles/CreateArticle', {
        method: 'POST',
        body: JSON.stringify({
          title: payload.title,
          publishDate: payload.publishDate,
          authorString: payload.authorString,
          headerPhotoLink: payload.headerPhotoLink,
          extraPhotoLinks: payload.extraPhotoLinks,
          articleText: payload.articleText,
        }),
      });

      return {
        success: true,
        data: {
          createdArticleId: response?.createdArticleId || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при создании статьи',
        data: null,
      };
    }
  }

  /**
   * Обновление статьи
   * @param {object} payload
   */
  async updateArticle(payload) {
    try {
      const response = await apiRequest('/Articles/UpdateArticle', {
        method: 'PUT',
        body: JSON.stringify({
          articleId: payload.articleId,
          newTitle: payload.newTitle,
          newPublishDate: payload.newPublishDate,
          newAuthorString: payload.newAuthorString,
          newHeaderPhotoLink: payload.newHeaderPhotoLink,
          newExtraPhotoLinks: payload.newExtraPhotoLinks,
          newArticleText: payload.newArticleText,
        }),
      });

      return {
        success: true,
        data: {
          updatedArticleId: response?.updatedArticleId || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при обновлении статьи',
        data: null,
      };
    }
  }

  /**
   * Удаление статьи
   * @param {string} articleId
   */
  async deleteArticle(articleId) {
    try {
      const response = await apiRequest(`/Articles/DeleteArticle?articleId=${encodeURIComponent(articleId)}`, {
        method: 'DELETE',
      });

      return {
        success: true,
        data: {
          deletedArticleId: response?.deletedArticleId || null,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Ошибка при удалении статьи',
        data: null,
      };
    }
  }
}

export default new ArticlesAPI();
