import React from "react";
import { FilterMenu } from "../../../../components/shared/ui/base/Filter/FilterMenu";
import { FilterCheckBoxSection } from "../../../../components/shared/ui/base/Filter/FilterSections/FilterCheckBoxSection";
import "../../../../components/shared/ui/base/Filter/FilterMenu/styles.css";

interface FilterMenuMushroomProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    edibility: string[];
    capType: string[];
  };
  onFilterChange: (category: 'edibility' | 'capType', value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const edibilityOptions = [
  { value: 'edible', label: 'Съедобные' },
  { value: 'semi-edible', label: 'Условно-съедобные' },
  { value: 'inedible', label: 'Несъедобные' },
];

const capTypeOptions = [
  { value: 'convex', label: 'Выпуклая' },
  { value: 'flat', label: 'Плоская' },
  { value: 'funnel', label: 'Вдавленная' },
];

export const FilterMenuMushroom: React.FC<FilterMenuMushroomProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  onApply
}) => {
  return (
    <FilterMenu
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      onApply={onApply}
    >
      <FilterCheckBoxSection
        title="Съедобность"
        options={edibilityOptions}
        selectedValues={filters.edibility}
        onOptionChange={(value) => onFilterChange('edibility', value)}
      />
      
      <FilterCheckBoxSection
        title="Тип шляпки"
        options={capTypeOptions}
        selectedValues={filters.capType}
        onOptionChange={(value) => onFilterChange('capType', value)}
      />
    </FilterMenu>
  );
};
