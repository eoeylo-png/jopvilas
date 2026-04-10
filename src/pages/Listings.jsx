import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import './Listings.css';

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.area) {
        query = query.eq('canton', filters.area);
      }
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.minBedrooms) {
        query = query.gte('bedrooms', parseInt(filters.minBedrooms));
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      area: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
    });
  };

  const nakuruAreas = [
    'Nakuru City', 'Naivasha', 'Molo', 'Gilgil', 'Njoro', 'Ototema', 'Bahati', 'Kuresoi', 'Rongai', 'Mai Mahiu'
  ];

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
  ];

  return (
    <div className="listings">
      <div className="listings-container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={resetFilters} className="reset-btn">Reset</button>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Nakuru Area</label>
            <select
              name="area"
              value={filters.area}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Areas</option>
              {nakuruAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Bedrooms</label>
            <select
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}+ bedrooms
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price (CHF)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Max Price (CHF)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="10000000"
              className="filter-input"
            />
          </div>
        </aside>

        <main className="listings-main">
          <div className="listings-header">
            <h2>Properties for Sale</h2>
            <p className="results-count">
              {loading ? 'Loading...' : `${properties.length} results found`}
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <span className="no-results-icon">🔍</span>
                <h3>No properties found</h3>
                <p>Try adjusting your filters to find what you're looking for</p>
                <button onClick={resetFilters} className="reset-btn-large">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
