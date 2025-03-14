import React, { ReactNode } from "react";
import "./styles.css";

interface OpenFilterMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export const OpenFilterMenuButton: React.FC<OpenFilterMenuButtonProps> = ({
  isOpen,
  onToggle,
  children
}) => {
  return (
    <button className="dropdown-toggle" onClick={onToggle}>
      <span><img src="/images/svg/group.svg" alt="Filter"/></span>
      <span className="arrow">
        {isOpen ? (
          <img src="/images/svg/vector-up.svg" alt="Close"/>
        ) : (
          <img src="/images/svg/vector.svg" alt="Open"/>
        )}
      </span>
      {children}
    </button>
  );
};
