import { Link } from "react-router-dom";
import "./index.css";
import React, { ReactNode } from "react";

interface FilterButtonsProps {
    targetPath: string;
    buttonComponent: ReactNode;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ targetPath, buttonComponent }) => {

    return (
        <div className="bottonsConteiner">
            <button className="grid-button"> 
                <Link to={ targetPath }  >
                    <img src="/images/svg/grid-view.svg" alt="" />
                </Link>
            </button>
            {buttonComponent}
        </div>
            
    );
}

export default FilterButtons;