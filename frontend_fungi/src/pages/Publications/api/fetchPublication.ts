import { IPublications } from '../model/types.ts';
import axios from 'axios';

export const fetchPublication = async (
    id: string | undefined
): Promise<IPublications | undefined> => {
    try {
        const response = await axios.get(
            `http://localhost:5000/publications/${id}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching publication data:', error);
        return;
    }
};
