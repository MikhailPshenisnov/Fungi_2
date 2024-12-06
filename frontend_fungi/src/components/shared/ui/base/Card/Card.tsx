import React, { ReactNode } from "react";
import "./Card.css";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
    children, 
    className = "", 
    onClick 
}) => {
    return (
        <div 
            className={`base-card ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
