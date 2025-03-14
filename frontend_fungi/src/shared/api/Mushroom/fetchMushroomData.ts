import { TMushroomCard } from '@pages/Encyclopedia/types';
import axios from 'axios';

export const fetchMushroomData = async (): Promise<TMushroomCard[]> => {
    try {
        const response = await axios.get('http://localhost:5000/mushrooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching mushroom data:', error);
        return [];
    }
};
