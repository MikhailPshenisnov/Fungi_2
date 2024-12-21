import React from "react";
import "./FilterButton.css";

interface FilterDropdownProps {
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

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  onApply
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="dropdown-menu">
        <div className="filter-header">
          <h3>Фильтры</h3>
          <button className="close-button" onClick={onClose}>
            <img src="/images/svg/close.svg" alt="Close" />
          </button>
        </div>
        
        <div className="filter-content">
          <div className="filter-section">
            <h4>Съедобность</h4>
            <div className="filter-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.edibility.includes('edible')}
                  onChange={() => onFilterChange('edibility', 'edible')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Съедобные</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.edibility.includes('semi-edible')}
                  onChange={() => onFilterChange('edibility', 'semi-edible')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Условно-съедобные</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.edibility.includes('inedible')}
                  onChange={() => onFilterChange('edibility', 'inedible')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Несъедобные</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Тип шляпки</h4>
            <div className="filter-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.capType.includes('convex')}
                  onChange={() => onFilterChange('capType', 'convex')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Выпуклая</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.capType.includes('flat')}
                  onChange={() => onFilterChange('capType', 'flat')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Плоская</span>
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.capType.includes('funnel')}
                  onChange={() => onFilterChange('capType', 'funnel')}
                />
                <span className="checkbox-custom"></span>
                <span className="label-text">Вдавленная</span>
              </label>
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button className="reset-button" onClick={onReset}>
            Сбросить
          </button>
          <button className="apply-button" onClick={onApply}>
            Применить
          </button>
        </div>
      </div>
    </>
  );
};
