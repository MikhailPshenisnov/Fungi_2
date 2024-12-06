import { Link } from "react-router-dom";
import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./index.css";
import React from "react";

interface FilterButtonsProps {
    targetPath: string; // Целевой маршрут
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ targetPath }) => {

    return (
        <div className="bottonsConteiner">
            <button className="grid-button"> 
                <Link to={ targetPath }  >
                    <img src="/images/svg/grid-view.svg" alt="" />
                </Link>
            </button>
            <SortDropdown/>
        </div>
            
    );
}

export default FilterButtons;