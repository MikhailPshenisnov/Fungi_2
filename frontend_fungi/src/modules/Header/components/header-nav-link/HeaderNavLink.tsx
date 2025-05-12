import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';

interface Props {
    link: string;
    linkName: string;
}

export const HeaderNavLink: React.FC<Props> = ({ link, linkName}) => {
    // const location = useLocation();

    return (
        <li>
            <NavLink
                to={link}
                style={({ isActive }) => ({
                    textDecoration:'none',
                    color: isActive ? '#E6C49C' : '#323142',
                    borderBottom: isActive ? '3px solid #E6C49C' : 'none',
                    paddingBottom: isActive ? '4px' : '0',
                    transition: 1
                })}
            >
                {linkName}
            </NavLink>
        </li>
    );
}
