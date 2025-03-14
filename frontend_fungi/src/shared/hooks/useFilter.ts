import { useMemo } from 'react';

interface FilterConfig<T> {
    filters: Record<string, string[]>;
    filterMappings: Record<string, {
        field: keyof T;
        valueMap: Record<string, string>;
    }>;
    searchField?: keyof T;
    searchQuery?: string;
}

export const useFilter = <T extends Record<string, any>>({
    data,
    filters,
    filterMappings,
    searchField,
    searchQuery = ''
}: FilterConfig<T> & { data: T[] }) => {
    const isFiltersActive = Object.values(filters).some(filterValues => filterValues.length > 0);
    const isSearchActive = searchQuery.trim() !== '';

    const filteredData = useMemo(() => {
        // First apply filters
        const filteredByType = data.filter(item => {
            if (!isFiltersActive) return true;

            // Check each filter category
            return Object.entries(filters).every(([filterKey, activeFilters]) => {
                if (activeFilters.length === 0) return true;

                const mapping = filterMappings[filterKey];
                if (!mapping) return true;

                return activeFilters.some(filter => {
                    const expectedValue = mapping.valueMap[filter];
                    return item[mapping.field] === expectedValue;
                });
            });
        });

        // Then apply search if needed
        if (isSearchActive && searchField) {
            return filteredByType.filter(item => {
                const fieldValue = String(item[searchField]).toLowerCase();
                return fieldValue.includes(searchQuery.toLowerCase());
            });
        }

        return filteredByType;
    }, [data, filters, searchQuery, isFiltersActive, isSearchActive]);

    return {
        filteredData,
        isFiltersActive,
        isSearchActive
    };
};
