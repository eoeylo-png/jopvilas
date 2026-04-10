import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const nakuruAreas = ['Nakuru City', 'Naivasha', 'Molo', 'Gilgil', 'Njoro'];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .limit(6);

        if (error) throw error;
        setFeatured(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity) {
      navigate(`/listings?city=${encodeURIComponent(searchCity)}`);
    } else {
      navigate('/listings');
    }
  };

  const handleAreaClick = (area) => {
    navigate(`/listings?area=${area}`);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Property in Switzerland</h1>
          <p className="hero-subtitle">
            Discover luxury homes, modern apartments, and prime real estate across Nakuru area
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>

          <div className="quick-filters">
            <span className="filter-label">Popular Areas:</span>
            <div className="filter-buttons">
              {nakuruAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleAreaClick(area)}
                  className="filter-btn"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-background"></div>
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Premium listings available now</p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : featured.length > 0 ? (
            <div className="properties-grid">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="no-properties">
              <p>No properties available at the moment</p>
            </div>
          )}

          <div className="section-footer">
            <button onClick={() => navigate('/listings')} className="explore-btn">
              Explore All Properties
            </button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">600+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">26</div>
              <div className="stat-label">nakuru towns</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
