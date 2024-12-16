import { useState } from "react";
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
        <span className="arrow">{isOpen ? <img src="/images/svg/vector-up.svg"/> : <img src="/images/svg/vector.svg"/>}</span>
      </button>
      {isOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="dropdown-menu">
            <div className="filter-header">
              <h3>Фильтры</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>
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
                      onChange={() => handleCheckboxChange('edibility', 'edible')}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">Съедобные</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={filters.edibility.includes('semi-edible')}
                      onChange={() => handleCheckboxChange('edibility', 'semi-edible')}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">Условно-съедобные</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={filters.edibility.includes('inedible')}
                      onChange={() => handleCheckboxChange('edibility', 'inedible')}
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
                      onChange={() => handleCheckboxChange('capType', 'convex')}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">Выпуклая</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={filters.capType.includes('flat')}
                      onChange={() => handleCheckboxChange('capType', 'flat')}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">Плоская</span>
                  </label>
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={filters.capType.includes('funnel')}
                      onChange={() => handleCheckboxChange('capType', 'funnel')}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="label-text">Воронковидная</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="filter-footer">
              <button className="reset-button" onClick={handleReset}>
                Сбросить
              </button>
              <button className="apply-button" onClick={handleApplyFilters}>
                Применить
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterButton;
