import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleInputChange}
        className="search-input"
        required
        minLength="1"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchBar;
