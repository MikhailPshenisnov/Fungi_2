import { useQuery } from "@tanstack/react-query";
import { mockMushrooms } from "./mock/mushrooms";
import { TMushroomCard } from "../../pages/Encyclopedia/types";
// import axios from "axios";

const fetchMushroomData = async (): Promise<TMushroomCard[]> => {
    try {
        // Временно возвращаем моковые данные, пока API не готов
        return mockMushrooms;
        
        // Раскомментируйте код ниже, когда API будет готов
        // const response = await axios.get('api/mushrooms');
        // return response.data;
    }
    catch (error) {
        console.error('Error fetching mushroom data:', error);
        return mockMushrooms;
    }
};

export const useMushroomData = () => {
    return useQuery<TMushroomCard[]>({
        queryKey: ['mushrooms'],
        queryFn: fetchMushroomData,
        initialData: mockMushrooms, // Добавляем initialData для немедленного отображения
    });
};