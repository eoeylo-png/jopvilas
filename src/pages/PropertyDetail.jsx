import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          agents (
            id,
            name,
            email,
            phone,
            company,
            image_url
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/listings');
        return;
      }

      setProperty(data);
      if (data.agents) {
        setAgent(data.agents);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="property-detail loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail not-found">
        <div className="not-found-content">
          <h2>Property not found</h2>
          <button onClick={() => navigate('/listings')} className="back-btn">
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-detail">
      <div className="detail-container">
        <button onClick={() => navigate('/listings')} className="back-btn-top">
          ← Back to Listings
        </button>

        <div className="detail-gallery">
          <div className="main-image">
            <img src={images[selectedImage]} alt={property.title} />
            <div className="badge">{property.property_type}</div>
          </div>

          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${idx === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${property.title} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="main-info">
            <h1 className="detail-title">{property.title}</h1>
            <p className="detail-location">
              📍 {property.location} • {property.city}, {property.area || property.canton}
            </p>

            <div className="price-section">
              <div className="price">{formatPrice(property.price)}</div>
            </div>

            <div className="specs-grid">
              {property.bedrooms && (
                <div className="spec-box">
                  <div className="spec-icon">🛏️</div>
                  <div className="spec-value">{property.bedrooms}</div>
                  <div className="spec-label">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="spec-box">
                  <div className="spec-icon">🚿</div>
                  <div className="spec-value">{property.bathrooms}</div>
                  <div className="spec-label">Bathrooms</div>
                </div>
              )}
              {property.living_area && (
                <div className="spec-box">
                  <div className="spec-icon">📐</div>
                  <div className="spec-value">{Math.round(property.living_area)}</div>
                  <div className="spec-label">Living Area (m²)</div>
                </div>
              )}
              {property.plot_area && (
                <div className="spec-box">
                  <div className="spec-icon">🏞️</div>
                  <div className="spec-value">{Math.round(property.plot_area)}</div>
                  <div className="spec-label">Plot Area (m²)</div>
                </div>
              )}
              {property.year_built && (
                <div className="spec-box">
                  <div className="spec-icon">📅</div>
                  <div className="spec-value">{property.year_built}</div>
                  <div className="spec-label">Year Built</div>
                </div>
              )}
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{property.description || 'No description available'}</p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="features-section">
                <h3>Features & Amenities</h3>
                <div className="features-grid">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="feature-tag">
                      ✓ {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {agent && (
            <aside className="agent-sidebar">
              <div className="agent-card">
                <img src={agent.image_url} alt={agent.name} className="agent-image" />
                <h3>{agent.name}</h3>
                <p className="agent-company">{agent.company}</p>

                <div className="agent-contact">
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="contact-btn">
                      ✉️ Send Email
                    </a>
                  )}
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="contact-btn">
                      📞 Call
                    </a>
                  )}
                </div>

                <button className="inquiry-btn">Schedule Viewing</button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
