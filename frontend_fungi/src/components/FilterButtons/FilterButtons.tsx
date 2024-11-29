import { Link } from "react-router-dom";
import SortDropdown from "../../components/SortDropdown/SortDropdown.tsx";
import "./index.css";





const FilterButtons = () => {

    return (
        <div className="bottonsConteiner">
            <button> 
                <Link to="/publications-sec"  >
                    <img src="./public/images/grid-view.svg" alt="" />
                </Link>
            </button>
            <SortDropdown/>
        </div>
            
    );
}

export default FilterButtons;