import React from 'react';
import './styles.css';
import NavBar from "../../components/NavBar";

function LandingPage(){
    return (
        <div className="landing-page">
            <NavBar />
            <h1>Landing Page</h1>
            <p>Landing page placeholder text.</p>
        </div>
    );
}

export default LandingPage;