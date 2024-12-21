import React from "react";
import "./styles.css";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterCheckBoxSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onOptionChange: (value: string) => void;
}

export const FilterCheckBoxSection: React.FC<FilterCheckBoxSectionProps> = ({
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
