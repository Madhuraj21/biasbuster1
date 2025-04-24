import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AboutUsPage from './pages/AboutUsPage';
import ArticleAnalysisPage from './pages/ArticleAnalysisPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import Navbar from './components/Navbar'; // Import the Navbar component
import './App.css'; // Import the main CSS file

function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar component here */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/analyze" element={<ArticleAnalysisPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
