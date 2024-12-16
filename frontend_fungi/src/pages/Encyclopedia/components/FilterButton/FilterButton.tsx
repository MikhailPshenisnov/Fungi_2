import { useState } from "react";
import "./FilterButton.css";

const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleApplyFilters = () => {
    setIsOpen(false);
    // Здесь будет логика применения фильтров
  };

  return (
    <div className="filter-button">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <span><img src="/images/svg/group.svg"/></span>
        <span className="arrow">{isOpen ? <img src="/images/svg/vector-up.svg"/> : <img src="/images/svg/vector.svg"/>}</span>
      </button>
      {isOpen && (
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
                <label>
                  <input type="checkbox" name="edible" value="edible" />
                  <span>Съедобные</span>
                </label>
                <label>
                  <input type="checkbox" name="edible" value="semi-edible" />
                  <span>Условно-съедобные</span>
                </label>
                <label>
                  <input type="checkbox" name="edible" value="inedible" />
                  <span>Несъедобные</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Тип шляпки</h4>
              <div className="filter-options">
                <label>
                  <input type="checkbox" name="cap-type" value="convex" />
                  <span>Выпуклая</span>
                </label>
                <label>
                  <input type="checkbox" name="cap-type" value="flat" />
                  <span>Плоская</span>
                </label>
                <label>
                  <input type="checkbox" name="cap-type" value="funnel" />
                  <span>Воронковидная</span>
                </label>
              </div>
            </div>
          </div>

          <div className="filter-footer">
            <button className="reset-button" onClick={() => {}}>
              Сбросить
            </button>
            <button className="apply-button" onClick={handleApplyFilters}>
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
