import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="encyclopedia__search">
            <button className="encyclopedia__search-button">
                <img
                    src="/images/png/search-icon.png"
                    alt="Search"
                />
            </button>
            <input
                type="text"
                placeholder="Поиск грибов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="encyclopedia__search-input"
            />
            <button className="encyclopedia__filter-button">
                <img
                    src="/images/svg/close.svg"
                    alt="Filter"
                />
            </button>
        </div>
    );
};
