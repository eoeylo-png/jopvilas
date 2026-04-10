import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About RealEstate</h3>
          <p>Premium real estate listings across Nakuru. Find your dream property today.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#listings">Properties</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: jopvilasrealestatelimited@gmail.com</p>
          <p>Phone: +254714474621</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 RealEstate. All rights reserved.</p>
      </div>
    </footer>
  );
}
