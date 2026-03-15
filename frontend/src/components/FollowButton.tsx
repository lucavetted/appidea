import React, { useState, useEffect } from 'react';
import { followService } from '../services/api';
import '../styles/FollowButton.css';

interface FollowButtonProps {
  userId: number;
  isCurrentUser: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ userId, isCurrentUser, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await followService.isFollowing(userId);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    if (!isCurrentUser) {
      checkFollowStatus();
    }
  }, [userId, isCurrentUser]);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followService.followUser(userId);
        setIsFollowing(true);
      }
      onFollowChange?.(isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isCurrentUser) {
    return null;
  }

  return (
    <button
      className={`follow-btn ${isFollowing ? 'following' : ''}`}
      onClick={handleFollowToggle}
      disabled={loading}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};
