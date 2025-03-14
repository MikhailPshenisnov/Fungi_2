import React, { useState } from "react";
import "./index.css";
import { MushroomCard } from "./components/MushroomCard/MushroomCard";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { useMushroomData } from "../../shared/api/useMushroomData";
import { MushroomFilter } from "./components/MushroomFilter/MushroomFilter";
import OpenMushroomFilterMenuButton from "./components/Filter";
import FilterButtons from "@shared/ui/FilterButtons";

interface FilterState {
  edibility: string[];
  capType: string[];
}

export const Encyclopedia: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    edibility: [],
    capType: [],
  });

  const { data: mushrooms, isLoading, error } = useMushroomData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!mushrooms || !Array.isArray(mushrooms))
    return <div>No mushrooms data available</div>;

  const { filteredMushrooms, isFiltersActive, isSearchActive } = MushroomFilter(
    {
      mushrooms,
      filters,
      searchQuery,
    }
  );

  // Если нет ни фильтров, ни поиска, разделяем по категориям
  const edibleMushrooms =
    !isFiltersActive && !isSearchActive
      ? mushrooms.filter((mushroom) => mushroom.eatable === "Да")
      : [];
  const semiEdibleMushrooms =
    !isFiltersActive && !isSearchActive
      ? mushrooms.filter((mushroom) => mushroom.eatable === "Полусъедобен")
      : [];

  return (
    <div className="encyclopedia">
      <div className="encyclopedia__header">
        <FilterButtons
          targetPath="/encyclopedia"
          buttonComponent={
            <OpenMushroomFilterMenuButton
              filters={filters}
              setFilters={setFilters}
            />
          }
        />
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {isFiltersActive || isSearchActive ? (
        <section className="encyclopedia__section">
          <h2 className="encyclopedia__section-title">
            {filteredMushrooms.length > 0
              ? `Найдено грибов: ${filteredMushrooms.length}`
              : "Грибы не найдены"}
          </h2>
          <div className="encyclopedia__cards-row">
            {filteredMushrooms.map((mushroom) => (
              <MushroomCard key={mushroom.name} mushroom={mushroom} />
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="encyclopedia__section">
            <h2 className="encyclopedia__section-title">Съедобные грибы</h2>
            <div className="encyclopedia__cards-row">
              {edibleMushrooms.map((mushroom) => (
                <MushroomCard key={mushroom.name} mushroom={mushroom} />
              ))}
            </div>
          </section>

          <section className="encyclopedia__section">
            <h2 className="encyclopedia__section-title">
              Условно-съедобные грибы
            </h2>
            <div className="encyclopedia__cards-row">
              {semiEdibleMushrooms.map((mushroom) => (
                <MushroomCard key={mushroom.name} mushroom={mushroom} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Encyclopedia;
