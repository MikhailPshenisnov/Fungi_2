import { useFilter } from '../../../../redux/hooks/useFilter';
import { IMushroom, MushroomFilterProps } from '../../../../api/AppApi.ts';

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
                edible: 'Съедобный',
                'semi-edible': 'Полусъедобный',
                inedible: 'Несъедобный',
            },
        },
        capType: {
            field: 'capType',
            valueMap: {
                convex: 'выпуклый',
                flat: 'плоская',
                funnel: 'вдавленная',
                hemispherical: 'полушаровидный',
                bell_shaped: 'колокольчатый',
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
