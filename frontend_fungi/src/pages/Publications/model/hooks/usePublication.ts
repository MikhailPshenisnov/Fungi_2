import { IPublications } from '../types.ts';
import { fetchPublication } from '../../api';
import { useQuery } from '@tanstack/react-query';

export const usePublication = (id: string | undefined) => {
    const publicationFn = () => fetchPublication(id);
    return useQuery<IPublications | undefined>({
        queryKey: [`publication`],
        queryFn: publicationFn,
    });
};