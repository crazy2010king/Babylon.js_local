import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import './home.scss';

interface SearchComponentProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  placeholder = 'Search examples...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <span className="search-icon material-icons">search</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button
            className="search-clear-button"
            onClick={handleClear}
            title="Clear search"
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
