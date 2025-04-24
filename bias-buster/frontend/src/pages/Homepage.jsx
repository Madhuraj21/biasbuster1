import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Homepage.css'; // Import Homepage specific styles

function Homepage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">
        Eliminate Bias in <br />
        <span>News & AI Systems</span>
      </h1>
      <p className="homepage-subtitle">
        BiasBuster helps media organizations and AI developers identify, analyze, and mitigate bias in content and
        algorithms, ensuring fair and ethical reporting.
      </p>
      <div className="homepage-buttons">
        <Link to="/register" className="homepage-button homepage-primary-button">
          Start Free Trial →
        </Link>
        <Link to="/features" className="homepage-button homepage-secondary-button">
          Watch Demo
        </Link>
      </div>
      <div className="homepage-section">
        <h2>Trusted by 2,000+ news organizations</h2>
      </div>
      <div className="homepage-section">
        <h2>News Organizations Adopt Bias Detection Tools</h2>
        <p>Major publications implement AI solutions to ensure balanced reporting</p>
      </div>
    </div>
  );
}

export default Homepage;
