import { IPublications } from '@pages/publications/model/types';
import { rtkQueryApi } from '@shared/api/rtkQueryApi';

const publicationsApi = rtkQueryApi.injectEndpoints({
    endpoints: (build) => ({
        getPublications: build.query<IPublications[], void>({
            query: () => ({
                url: '/Articles/GetFilteredArticles',
                method: 'GET',
            }),
        }),
        getPublicationById: build.query<IPublications, string>({
            query: (id) => ({
                url: `/Articles/GetArticle/${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetPublicationsQuery, useGetPublicationByIdQuery } =
    publicationsApi;
