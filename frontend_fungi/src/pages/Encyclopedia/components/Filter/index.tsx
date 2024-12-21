import React, { useState } from "react";
import { OpenFilterMenuButton } from "../../../../components/shared/ui/base/Filter/OpenFilterMenuButton";
import { FilterMenuMushroom } from "./FilterMenuMushroom";

interface OpenMushroomFilterMenuButtonProps {
  filters: {
    edibility: string[];
    capType: string[];
  };
  setFilters: (filters: { edibility: string[]; capType: string[] }) => void;
}

const OpenMushroomFilterMenuButton: React.FC<OpenMushroomFilterMenuButtonProps> = ({
  filters,
  setFilters
}) => {
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
      <OpenFilterMenuButton isOpen={isOpen} onToggle={toggleDropdown} />
      
      <FilterMenuMushroom
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

export default OpenMushroomFilterMenuButton;
