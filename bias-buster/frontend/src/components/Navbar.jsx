import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navbarRef]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>BiasBuster</Link>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu}>
        &#9776;
      </button>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/features" onClick={closeMenu}>Features</Link>
        <Link to="/analyze" onClick={closeMenu}>News Analysis</Link>
        <Link to="/testimonials" onClick={closeMenu}>Testimonials</Link>
        <Link to="/pricing" onClick={closeMenu}>Pricing</Link>
        <Link to="/login" onClick={closeMenu}>Log in</Link>
        <Link to="/register" className="navbar-signup-btn" onClick={closeMenu}>Sign up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
