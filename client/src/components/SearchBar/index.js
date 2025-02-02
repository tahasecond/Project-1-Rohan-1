import React, { useState } from 'react';
import './styles.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  // Handle input changes and update state
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // When the form is submitted, prevent the default behavior
  // and call the onSearch callback (if provided) with the current query.
  const handleSearch = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
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
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchBar;
