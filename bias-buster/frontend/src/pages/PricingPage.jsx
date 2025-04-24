import React from 'react';
import './PricingPage.css';

function PricingPage() {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Pricing</h1>
      <div className="pricing-tiers">
        <div className="pricing-tier-card">
          <h3>Free Tier</h3>
          <p className="price">0<span>/month</span></p>
          <ul>
            <li>5 analyses/month</li>
            <li>Basic bias detection</li>
            <li>Limited related articles</li>
          </ul>
          <button>Get Started</button>
        </div>
        <div className="pricing-tier-card">
          <h3>Pro Tier</h3>
          <p className="price">10<span>/month</span></p>
          <ul>
            <li>Unlimited analyses</li>
            <li>Advanced bias detection</li>
            <li>Unlimited related articles</li>
            <li>User profiles and history</li>
            <li>Secure authentication</li>
          </ul>
          <button>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
