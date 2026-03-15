import React from 'react';
import '../styles/BadgeDisplay.css';

interface BadgeDisplayProps {
  badge?: string;
  isVerified?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, isVerified }) => {
  const getBadgeInfo = (badgeName: string) => {
    switch (badgeName) {
      case 'top_rated':
        return {
          icon: '',
          label: 'Top Rated',
          color: 'gold',
        };
      case 'photographer':
        return {
          icon: '',
          label: 'Photographer',
          color: 'purple',
        };
      case 'influencer':
        return {
          icon: '',
          label: 'Influencer',
          color: 'blue',
        };
      case 'food_critic':
        return {
          icon: '',
          label: 'Food Critic',
          color: 'orange',
        };
      default:
        return null;
    }
  };

  const badgeInfo = badge ? getBadgeInfo(badge) : null;

  return (
    <div className="badge-display">
      {isVerified && (
        <div className="badge verified-badge" title="Verified">
          
        </div>
      )}
      {badgeInfo && (
        <div
          className={`badge ${badgeInfo.color}-badge`}
          title={badgeInfo.label}
        >
          {badgeInfo.icon}
        </div>
      )}
    </div>
  );
};
