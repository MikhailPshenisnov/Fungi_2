import { fetchPublicationsData } from '../../api';
import { IPublications } from '../types.ts';
import { useQuery } from '@tanstack/react-query';

export const usePublicationsData = () => {
    return useQuery<IPublications[]>({
        queryKey: ['publications'],
        queryFn: fetchPublicationsData,
    });
};
