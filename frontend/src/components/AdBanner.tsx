import React from 'react';
import '../styles/AdBanner.css';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  return (
    <div className={`ad-banner ad-${position}`}>
      <div className="ad-placeholder">
        <p>Advertisement - {position}</p>
        <small>Ad space available here</small>
      </div>
    </div>
  );
};

export default AdBanner;
