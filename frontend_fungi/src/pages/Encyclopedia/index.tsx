import React, { useState } from "react";
import "./index.css";
import { MushroomCard } from "./components/MushroomCard/MushroomCard";
import FilterButtons from "../../components/shared/ui/FilterButtons/FilterButtons";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { TMushroomCard } from "./types";

// Данные о грибах
const mockMushrooms: TMushroomCard[] = [
    {
        id: 1,
        imageUrl: "/images/png/mushrooms/boletus.png",
        russianName: "Белый гриб",
        latinName: "Boletus edulis",
        family: "Болетовые",
        isEdible: true,
        isRedBook: false
    },
    {
        id: 2,
        imageUrl: "/images/png/mushrooms/chanterelle.png",
        russianName: "Лисичка обыкновенная",
        latinName: "Cantharellus cibarius",
        family: "Лисичковые",
        isEdible: true,
        isRedBook: false
    },
    {
        id: 3,
        imageUrl: "/images/png/mushrooms/amanita.png",
        russianName: "Мухомор красный",
        latinName: "Amanita muscaria",
        family: "Аманитовые",
        isEdible: false,
        isRedBook: false
    },
    {
        id: 4,
        imageUrl: "/images/png/mushrooms/russula.png",
        russianName: "Сыроежка пищевая",
        latinName: "Russula vesca",
        family: "Сыроежковые",
        isEdible: true,
        isRedBook: false
    },
    {
        id: 5,
        imageUrl: "/images/png/mushrooms/cortinarius.png",
        russianName: "Паутинник фиолетовый",
        latinName: "Cortinarius violaceus",
        family: "Паутинниковые",
        isEdible: false,
        isRedBook: true
    }
];

export const Encyclopedia: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    
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
                    {mockMushrooms
                        .map(mushroom => (
                            <MushroomCard 
                                key={mushroom.id} 
                                mushroom={mushroom}
                            />
                        ))}
                </div>
            </section>

            <section className="encyclopedia__section">
                <h2 className="encyclopedia__section-title">Необычные грибы</h2>
                <div className="encyclopedia__cards-row">
                    {mockMushrooms
                        .map(mushroom => (
                            <MushroomCard 
                                key={mushroom.id} 
                                mushroom={mushroom}
                            />
                        ))}
                </div>
            </section>
        </div>
    );
};
