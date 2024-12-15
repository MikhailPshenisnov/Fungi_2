import { useQuery } from "@tanstack/react-query";
import { mockPublications } from "./mock/publications";
import { IPublications } from "../../pages/Publications/types";
// import axios from "axios";

const fetchPublicationData = async (): Promise<IPublications[]> => {
    try {
        // Временно возвращаем моковые данные, пока API не готов
        return mockPublications;
        
        // Раскомментируйте код ниже, когда API будет готов
        // const response = await axios.get('api/publications');
        // return response.data;
    }
    catch (error) {
        console.error('Error fetching publication data:', error);
        return mockPublications;
    }
};

export const usePublicationData = () => {
    return useQuery<IPublications[]>({
        queryKey: ['publications'],
        queryFn: fetchPublicationData,
        initialData: mockPublications, // Добавляем initialData для немедленного отображения
    });
};