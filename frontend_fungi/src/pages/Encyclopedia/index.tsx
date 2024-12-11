import React, { useState } from "react";
import "./index.css";
import { MushroomCard } from "./components/MushroomCard/MushroomCard";
import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons";
import { SearchBar } from "./components/SearchBar/SearchBar";
// import { TMushroomCard } from "./types";
import { useMushroomData } from "../../hooks/api/useMushroomData";

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {data: mushrooms, isLoading, error} = useMushroomData();
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!mushrooms || !Array.isArray(mushrooms)) return <div>No mushrooms data available</div>;

    return (
        <div className="encyclopedia">
            <div className="encyclopedia__header">
                <FilterButtons targetPath="/encyclopedia" />
            </div>

            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <section className="encyclopedia__section">
                <h2 className="encyclopedia__section-title">Популярные грибы</h2>
                <div className="encyclopedia__cards-row">
                    {mushrooms.map(mushroom => (
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
                    {mushrooms.map(mushroom => (
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
