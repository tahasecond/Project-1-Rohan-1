import React from 'react';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import './styles.css'

function LandingPage() {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // whatever search logic we want to find about (movies or reviews) goes here
  };

  return (
    <div className="landing-page">
      <NavBar />
      <div className="content">
        <h1>Welcome to GT Movies</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default LandingPage;
