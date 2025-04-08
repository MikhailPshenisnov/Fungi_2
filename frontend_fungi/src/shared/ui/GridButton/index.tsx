
interface IGridButton {
    onClick: () => void;
}

export const GridButton: React.FC<IGridButton> = ({ onClick }) => {
    return (
        <button className="grid-button" onClick={onClick}>
                <img src="/images/svg/grid-view.svg" alt="" />
        </button>
    );
};
