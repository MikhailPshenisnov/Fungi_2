import { IMushroom } from '@pages/encyclopedia/components/MushroomFilter/types';
import { rtkQueryApi } from '../rtkQueryApi';

export const mushroomsApi = rtkQueryApi.injectEndpoints({
    endpoints: (build) => ({
        getMushrooms: build.query<IMushroom[], void>({
            query: () => ({
                url: '/Mushrooms/GetFilteredMushrooms',
                method: 'GET',
            }),
            providesTags: ['Mushroom'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetMushroomsQuery } = mushroomsApi;
