import React, { useState } from 'react';
import './index.css';
import { MushroomCard } from './components/MushroomCard/MushroomCard';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useMushroomFilter } from './components/MushroomFilter/MushroomFilter';
import OpenMushroomFilterMenuButton from './components/Filter';
import { FilterButtons } from '@shared/ui';
import { Pagination } from '@modules/Pagination';
import { useGetMushroomsQuery } from '@shared/api/endpoints';
import { mockMushrooms } from '@shared/const/mock/mushrooms';

interface FilterState {
    edibility: string[];
    capType: string[];
    [key: string]: string[];
}

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        edibility: [],
        capType: [],
    });

    const {
        data: mushrooms = mockMushrooms,
        isLoading,
        isError,
        error,
    } = useGetMushroomsQuery();

    const { filteredMushrooms, isFiltersActive, isSearchActive } =
        useMushroomFilter({
            mushrooms: Array.isArray(mushrooms) ? mushrooms : [],
            filters,
            searchQuery,
        });

    if (isLoading) return <div>Loading...</div>;
    if (isError)
        return (
            <div>
                Error: {(error as any)?.status || 'Не удалось загрузить данные'}
            </div>
        );
    if (!Array.isArray(mushrooms) || mushrooms.length === 0)
        return <div>No mushrooms data available</div>;

    // Если нет ни фильтров, ни поиска, разделяем по категориям
    const PopularMushrooms =
        !isFiltersActive && !isSearchActive
            ? mushrooms
                  .slice()
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 5)
            : [];

    const AllMushrooms =
        !isFiltersActive && !isSearchActive ? mushrooms : filteredMushrooms;

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <FilterButtons
                    // targetPath="/encyclopedia"
                    onClick={() => {}}
                    buttonComponent={
                        <OpenMushroomFilterMenuButton
                            filters={filters}
                            setFilters={setFilters}
                        />
                    }
                />
            </div>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {isFiltersActive || isSearchActive ? (
                <section className="encyclopedia__section">
                    <h2 className="encyclopedia__section-title">
                        {filteredMushrooms.length > 0
                            ? `Найдено грибов: ${filteredMushrooms.length}`
                            : 'Грибы не найдены'}
                    </h2>
                    <div className="encyclopedia__cards-row">
                        {filteredMushrooms.map((mushroom) => (
                            <MushroomCard
                                key={mushroom.id}
                                mushroom={mushroom}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <>
                    <section className="encyclopedia__section">
                        <h2 className="encyclopedia__section-title">
                            Популярные Грибы
                        </h2>
                        <div className="encyclopedia__cards-row">
                            {PopularMushrooms.map((mushroom) => (
                                <MushroomCard
                                    key={mushroom.id}
                                    mushroom={mushroom}
                                />
                            ))}
                        </div>
                    </section>

                    <Pagination
                        data={AllMushrooms}
                        tittle={'Все грибы'}
                        itemsPerPage={10}
                        card={(mushroom) => (
                            <MushroomCard
                                key={mushroom.id}
                                mushroom={mushroom}
                            />
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default Encyclopedia;
