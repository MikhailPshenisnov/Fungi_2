import { useState } from "react";
import { FilterDropdown } from "./FilterDropdown";
import "./FilterButton.css";

interface FilterButtonProps {
  filters: {
    edibility: string[];
    capType: string[];
  };
  setFilters: (filters: { edibility: string[]; capType: string[] }) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (category: 'edibility' | 'capType', value: string) => {
    setFilters({
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter(item => item !== value)
        : [...filters[category], value]
    });
  };

  const handleReset = () => {
    setFilters({
      edibility: [],
      capType: []
    });
    setIsOpen(false);
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  return (
    <div className="filter-button">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <span><img src="/images/svg/group.svg"/></span>
        <span className="arrow">
          {isOpen ? <img src="/images/svg/vector-up.svg"/> : <img src="/images/svg/vector.svg"/>}
        </span>
      </button>
      
      <FilterDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        filters={filters}
        onFilterChange={handleCheckboxChange}
        onReset={handleReset}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default FilterButton;
