import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onOptionChange: (value: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onOptionChange,
}) => {
  return (
    <div className="filter-section">
      <h4>{title}</h4>
      <div className="filter-options">
        {options.map((option) => (
          <label key={option.value} className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => onOptionChange(option.value)}
            />
            <span className="checkbox-custom"></span>
            <span className="label-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
