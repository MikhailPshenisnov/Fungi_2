import { IPublications } from '@pages/Publications/types';
import { fetchPublicationData } from '@shared/api';
import { useQuery } from '@tanstack/react-query';

export const usePublicationData = () => {
    return useQuery<IPublications[]>({
        queryKey: ['publications'],
        queryFn: fetchPublicationData,
    });
};
