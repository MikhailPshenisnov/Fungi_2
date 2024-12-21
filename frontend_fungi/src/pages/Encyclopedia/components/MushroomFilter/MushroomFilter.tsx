import React from 'react';
import { Mushroom } from '../../../../types/mushroom';
import { useFilter } from '../../../../hooks/useFilter';

interface FilterState {
    edibility: string[];
    capType: string[];
}

interface MushroomFilterProps {
    mushrooms: Mushroom[];
    filters: FilterState;
    searchQuery: string;
}

export const MushroomFilter = ({ mushrooms, filters, searchQuery }: MushroomFilterProps) => {
    const filterMappings = {
        edibility: {
            field: 'eatable' as const,
            valueMap: {
                'edible': 'Да',
                'semi-edible': 'Полусъедобен',
                'inedible': 'Нет'
            }
        },
        capType: {
            field: 'cap_type' as const,
            valueMap: {
                'convex': 'Выпуклая',
                'flat': 'Плоская',
                'funnel': 'Вдавленная'
            }
        },
    };

    const { filteredData, isFiltersActive, isSearchActive } = useFilter<Mushroom>({
        data: mushrooms,
        filters,
        filterMappings,
        searchField: 'name',
        searchQuery
    });

    return {
        filteredMushrooms: filteredData,
        isFiltersActive,
        isSearchActive
    };
};
