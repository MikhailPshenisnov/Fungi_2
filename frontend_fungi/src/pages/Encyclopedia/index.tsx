import React, { useState } from "react";
import "./index.css";
import { MushroomCard } from "./components/MushroomCard/MushroomCard";
import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { useMushroomData } from "../../hooks/api/useMushroomData";
import FilterButton from "./components/FilterButton/FilterButton";



export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {data: mushrooms, isLoading, error} = useMushroomData();
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!mushrooms || !Array.isArray(mushrooms)) return <div>No mushrooms data available</div>;

    // Фильтруем ядовитые грибы
    const edibleMushrooms = mushrooms.filter(mushroom => mushroom.eatable !== "Нет");
    
    // Разделяем массив съедобных грибов на две части
    const halfLength = Math.ceil(edibleMushrooms.length / 2);
    const firstHalf = edibleMushrooms.slice(0, halfLength);
    const secondHalf = edibleMushrooms.slice(halfLength);

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <FilterButtons 
                    targetPath="/encyclopedia" 
                    buttonComponent={<FilterButton />}
                />
            </div>

            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <section className="encyclopedia__section">
                <h2 className="encyclopedia__section-title">Популярные грибы</h2>
                <div className="encyclopedia__cards-row">
                    {firstHalf.map(mushroom => (
                        <MushroomCard
                            key={mushroom.name}
                            mushroom={mushroom}
                        />
                    ))}
                </div>
            </section>

            <section className="encyclopedia__section">
                <h2 className="encyclopedia__section-title">Необычные грибы</h2>
                <div className="encyclopedia__cards-row">
                    {secondHalf.map(mushroom => (
                        <MushroomCard
                            key={mushroom.name}
                            mushroom={mushroom}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
