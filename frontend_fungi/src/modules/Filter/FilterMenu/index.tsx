import React, { ReactNode } from "react";
import "./styles.css";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  title?: string;
  children?: ReactNode;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen,
  onClose,
  onReset,
  onApply,
  title = "Фильтры",
  children
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="dropdown-menu">
        <div className="filter-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <img src="/images/svg/close.svg" alt="Close" />
          </button>
        </div>
        
        <div className="filter-content">
          {children}
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
