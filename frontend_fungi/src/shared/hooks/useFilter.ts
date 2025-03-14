import { useMemo } from 'react';

interface FilterConfig<T extends Record<string, unknown>> {
    filters: Record<string, string[]>;
    filterMappings: Record<
        string,
        { field: keyof T; valueMap: Record<string, string> }
    >;
    searchField: keyof T;
    searchQuery: string;
    data: T[];
}

export const useFilter = <T extends Record<string, unknown>>({
    data,
    filters,
    filterMappings,
    searchField,
    searchQuery = '',
}: FilterConfig<T>) => {
    const isFiltersActive = Object.values(filters).some(
        (filterValues) => filterValues.length > 0
    );
    const isSearchActive = searchQuery.trim() !== '';

    const filteredData = useMemo(() => {
        // 1. Применяем фильтры
        const filteredByType = data.filter((item) => {
            if (!isFiltersActive) return true;

            return Object.entries(filters).every(
                ([filterKey, activeFilters]) => {
                    if (activeFilters.length === 0) return true;

                    const mapping = filterMappings[filterKey];
                    if (!mapping) return true;

                    return activeFilters.some((filter) => {
                        const expectedValue = mapping.valueMap[filter];
                        return item[mapping.field] === expectedValue;
                    });
                }
            );
        });

        // 2. Применяем поиск
        if (isSearchActive && searchField) {
            return filteredByType.filter((item) => {
                const fieldValue = String(item[searchField]).toLowerCase();
                return fieldValue.includes(searchQuery.toLowerCase());
            });
        }

        return filteredByType;
    }, [
        data,
        filters,
        searchQuery,
        isFiltersActive,
        isSearchActive,
        filterMappings,
        searchField,
    ]); // ✅ Добавлен isSearchActive

    return {
        filteredData,
        isFiltersActive,
        isSearchActive,
    };
};
