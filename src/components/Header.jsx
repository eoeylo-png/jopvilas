import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">RealEstate</span>
          <span className="logo-icon">🏠</span>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/listings">Properties</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
