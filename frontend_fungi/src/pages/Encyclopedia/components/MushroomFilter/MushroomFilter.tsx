import { useFilter } from '@shared/hooks/useFilter';
import { MushroomFilterProps, IMushroom } from './types';

export const useMushroomFilter = ({
    mushrooms,
    filters,
    searchQuery,
}: MushroomFilterProps) => {
    const filterMappings: Record<
        string,
        { field: keyof IMushroom; valueMap: Record<string, string> }
    > = {
        edibility: {
            field: 'eatable',
            valueMap: {
                edible: 'Да',
                'semi-edible': 'Полусъедобен',
                inedible: 'Нет',
            },
        },
        capType: {
            field: 'capType',
            valueMap: {
                convex: 'Выпуклая',
                flat: 'Плоская',
                funnel: 'Вдавленная',
            },
        },
    };

    const { filteredData, isFiltersActive, isSearchActive } =
        useFilter<IMushroom>({
            data: mushrooms,
            filters,
            filterMappings,
            searchField: 'name',
            searchQuery,
        });

    return {
        filteredMushrooms: filteredData,
        isFiltersActive,
        isSearchActive,
    };
};
