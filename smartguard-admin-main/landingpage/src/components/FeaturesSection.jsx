import React from 'react';
import './FeaturesSection.css';

const features = [
  'Real-time Location Tracking',
  'Screen Time Management',
  'App & Web Filtering',
  'Geofencing & Alerts'
];

function FeaturesSection() {
  return (
    <div className="features-section">
      <ul className="features-list">
        {features.map((feature, index) => (
          <li key={index} className="feature-item">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeaturesSection; 