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
            <button> 
                <Link to={ targetPath }  >
                    <img src="./images/grid-view.svg" alt="" />
                </Link>
            </button>
            <SortDropdown/>
        </div>
            
    );
}

export default FilterButtons;