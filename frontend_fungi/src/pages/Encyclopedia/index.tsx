import React, { useState } from "react";
import "./index.css";
import { MushroomCard } from "./components/MushroomCard/MushroomCard";
import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { useMushroomData } from "../../hooks/api/useMushroomData";
import FilterButton from "./components/FilterButton/FilterButton";

interface FilterState {
    edibility: string[];
    capType: string[];
}

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({
        edibility: [],
        capType: []
    });
    
    const {data: mushrooms, isLoading, error} = useMushroomData();
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!mushrooms || !Array.isArray(mushrooms)) return <div>No mushrooms data available</div>;

    const isFiltersActive = filters.edibility.length > 0 || filters.capType.length > 0 || searchQuery;

    const filteredMushrooms = mushrooms.filter(mushroom => {
        // Применяем фильтры по съедобности
        if (filters.edibility.length > 0) {
            const edibilityMatch = filters.edibility.some(filter => {
                switch (filter) {
                    case 'edible':
                        return mushroom.eatable === "Да";
                    case 'semi-edible':
                        return mushroom.eatable === "Условно";
                    case 'inedible':
                        return mushroom.eatable === "Нет";
                    default:
                        return true;
                }
            });
            if (!edibilityMatch) return false;
        }

        // Применяем фильтры по типу шляпки
        if (filters.capType.length > 0) {
            const capTypeMatch = filters.capType.some(filter => {
                switch (filter) {
                    case 'convex':
                        return mushroom.cap_type === "Выпуклая";
                    case 'flat':
                        return mushroom.cap_type === "Плоская";
                    case 'funnel':
                        return mushroom.cap_type === "Воронковидная";
                    default:
                        return true;
                }
            });
            if (!capTypeMatch) return false;
        }

        // Применяем поиск по названию
        if (searchQuery) {
            return mushroom.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
    });

    // Разделяем грибы на категории только если нет активных фильтров
    const edibleMushrooms = !isFiltersActive 
        ? mushrooms.filter(mushroom => mushroom.eatable === "Да")
        : [];
    const semiEdibleMushrooms = !isFiltersActive 
        ? mushrooms.filter(mushroom => mushroom.eatable === "Условно")
        : [];

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <FilterButtons 
                    targetPath="/encyclopedia" 
                    buttonComponent={<FilterButton filters={filters} setFilters={setFilters} />}
                />
            </div>

            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {isFiltersActive ? (
                <section className="encyclopedia__section">
                    <h2 className="encyclopedia__section-title">
                        {filteredMushrooms.length > 0 ? 'Найденные грибы' : 'Грибы не найдены'}
                    </h2>
                    <div className="encyclopedia__cards-row">
                        {filteredMushrooms.map(mushroom => (
                            <MushroomCard
                                key={mushroom.name}
                                mushroom={mushroom}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <>
                    <section className="encyclopedia__section">
                        <h2 className="encyclopedia__section-title">Съедобные грибы</h2>
                        <div className="encyclopedia__cards-row">
                            {edibleMushrooms.map(mushroom => (
                                <MushroomCard
                                    key={mushroom.name}
                                    mushroom={mushroom}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="encyclopedia__section">
                        <h2 className="encyclopedia__section-title">Условно-съедобные грибы</h2>
                        <div className="encyclopedia__cards-row">
                            {semiEdibleMushrooms.map(mushroom => (
                                <MushroomCard
                                    key={mushroom.name}
                                    mushroom={mushroom}
                                />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Encyclopedia;
