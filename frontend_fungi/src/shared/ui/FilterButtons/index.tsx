import "./index.css";
import React, { ReactNode } from "react";
import GridButton from "../GridButton";

interface FilterButtonsProps {
  targetPath: string;
  buttonComponent: ReactNode;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  targetPath,
  buttonComponent,
}) => {
  return (
    <div className="bottonsConteiner">
      <GridButton targetPath={targetPath} />
      {buttonComponent}
    </div>
  );
};
