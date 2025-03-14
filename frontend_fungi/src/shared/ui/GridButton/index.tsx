import { Link } from 'react-router-dom';

interface IGridButton {
    targetPath: string;
}

export const GridButton: React.FC<IGridButton> = ({ targetPath }) => {
    return (
        <button className="grid-button">
            <Link to={targetPath}>
                <img src="/images/svg/grid-view.svg" alt="" />
            </Link>
        </button>
    );
};
