import { GridButton } from '../GridButton';
import './index.css';
import React, { ReactNode } from 'react';

interface FilterButtonsProps {
    onClick: () => void;
    buttonComponent: ReactNode;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
    onClick,
    buttonComponent,
}) => {
    return (
        <div className="bottonsConteiner">
            <GridButton onClick={onClick} />
            {buttonComponent}
        </div>
    );
};
