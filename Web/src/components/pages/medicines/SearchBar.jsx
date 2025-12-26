import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const SearchBar = ({ search, setSearch, placeholder = "Buscar..." }) => {
  const { theme } = useTheme();

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch style={{ color: theme.textMuted }} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          background: theme.backgroundCard,
          border: `1px solid ${theme.border}`,
          color: theme.textPrimary
        }}
        className="w-full pl-10 p-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;