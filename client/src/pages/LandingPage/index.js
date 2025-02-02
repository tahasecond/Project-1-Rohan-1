import React from 'react';
import NavBar from '../../components/NavBar';
import SearchBar from '../../components/SearchBar';
import './styles.css'
import { BrowserRouter as Navigate} from 'react-router-dom';

function LandingPage({ setIsAuthenticated }) {
  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // whatever search logic we want to find about (movies or reviews) goes here
  };

  return (
    <div className="landing-page">
      <NavBar setIsAuthenticated = {setIsAuthenticated}/>
      <div className="content">
        <h1>Welcome to GT Movies</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default LandingPage;
