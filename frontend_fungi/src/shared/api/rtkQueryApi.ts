import {
    createApi,
    FetchArgs,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithReauth = async (
    args: string | FetchArgs,
    api: any,
    extraOptions: any
) => {
    // Выполняем базовый запрос
    const result = await baseQuery(args, api, extraOptions);

    // Если 401 — удаляем токен локально. Можно также dispatch logout или редирект.
    if ((result as any)?.error?.status === 401) {
        localStorage.removeItem('token');
    }

    // Глобальная нормализация формы ответа от бэка.
    // Ожидаемые варианты ответа (пример):
    // { data: { articles: [...] }, errorMessage: null }
    // или { data: { data: { articles: [...] }, errorMessage: null }, errorMessage: null }
    try {
        if ((result as any)?.data) {
            let payload = (result as any).data;

            // Разворачиваем вложенные data слои: data.data.data... -> innermost
            while (
                payload &&
                typeof payload === 'object' &&
                'data' in payload
            ) {
                payload = payload.data;
            }

            // Если внутри есть коллекция articles или mushrooms — используем её
            if (payload && typeof payload === 'object') {
                if (Array.isArray((payload as any).articles)) {
                    (result as any).data = (payload as any).articles;
                } else if (Array.isArray((payload as any).mushrooms)) {
                    (result as any).data = (payload as any).mushrooms;
                } else {
                    // В остальных случаях просто заменим data на payload (обычный объект)
                    (result as any).data = payload;
                }
            }

            // Если где-то встретилось поле errorMessage — прокидываем его в error
            // в форме, которую понимает RTK Query. Используем any-каст, чтобы не ломать типы.
            const maybeErrorMessage =
                (payload && (payload as any).errorMessage) ||
                ((result as any).errorMessage as any);
            if (maybeErrorMessage) {
                (result as any).error = {
                    status: 'CUSTOM_ERROR',
                    data: maybeErrorMessage,
                };
                delete (result as any).data; // no data when error present
            }
        }
    } catch (e) {
        // в случае проблем с разбором — ничего не делаем
    }

    return result as any;
};

export const rtkQueryApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Mushroom'],
    endpoints: () => ({}),
});
