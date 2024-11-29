import React, { useState } from "react";
import "./SortDropdown.css"; // Для стилей

const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("По дате");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
    setIsOpen(false);
    console.log(`Выбрана сортировка: ${sortType}`); // Логика сортировки
  };

  return (
    <div className="sort-dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <span className="arrow">{isOpen ? <img src="./public/images/vector-up.svg"/> : <img src="./public/images/vector.svg"/>}</span>
        <span><img src="./public/images/group.svg"/></span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
            
          <button onClick={() => handleSortChange("По дате")}>
            По дате <span>↑↓</span>
          </button>
          <button onClick={() => handleSortChange("По популярности")}>
            По популярности <span>↑↓</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
