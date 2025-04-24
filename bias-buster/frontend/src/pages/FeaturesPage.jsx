import React from 'react';
import './FeaturesPage.css';

function FeaturesPage() {
  return (
    <div className="features-container">
      <h1 className="features-title">Features</h1>
      <ul className="features-list">
        <li>AI-powered bias detection</li>
        <li>Bias breakdown and suggestions</li>
        <li>User profiles and history</li>
        <li>Secure authentication</li>
      </ul>
    </div>
  );
}

export default FeaturesPage;
