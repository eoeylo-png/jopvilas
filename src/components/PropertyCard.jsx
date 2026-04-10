import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop';

  return (
    <Link to={`/property/${property.id}`} className="property-card-link">
      <div className="property-card">
        <div className="card-image-container">
          <img src={image} alt={property.title} className="card-image" />
          <div className="card-badge">{property.property_type}</div>
          <div className="card-overlay">
            <button className="view-btn">View Details</button>
          </div>
        </div>
        <div className="card-content">
          <h3 className="card-title">{property.title}</h3>
          <p className="card-location">{property.city}, {property.area || property.canton}</p>
          <p className="card-price">{formatPrice(property.price)}</p>
          <div className="card-specs">
            {property.bedrooms && (
              <span className="spec">
                <span className="spec-icon">🛏️</span>
                {property.bedrooms} bed
              </span>
            )}
            {property.bathrooms && (
              <span className="spec">
                <span className="spec-icon">🚿</span>
                {property.bathrooms} bath
              </span>
            )}
            {property.living_area && (
              <span className="spec">
                <span className="spec-icon">📐</span>
                {Math.round(property.living_area)} m²
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
