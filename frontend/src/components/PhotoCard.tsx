import React, { useState } from 'react';
import { ratingService } from '../services/api';
import { SaveButton } from './SaveButton';
import CommentSection from './CommentSection';
import '../styles/PhotoCard.css';

interface PhotoCardProps {
  photo: any;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showRating, setShowRating] = useState(false);

  const handleRatePhoto = async () => {
    if (rating === null) return;

    try {
      await ratingService.createRating(photo.id, rating, comment);
      setRating(null);
      setComment('');
      setShowRating(false);
    } catch (error) {
      console.error('Failed to rate photo:', error);
    }
  };

  return (
    <div className="photo-card">
      <img src={photo.photo_url} alt="User photo" />
      <div className="photo-info">
        <div className="user-info">
          {photo.avatar_url && <img src={photo.avatar_url} alt={photo.username} className="user-avatar" />}
          <span className="username">{photo.username}</span>
        </div>
        <p className="caption">{photo.caption}</p>
        <div className="photo-actions">
          <div className="rating-info">
            <span className="average-rating">
              {photo.average_rating ? photo.average_rating.toFixed(1) : 'N/A'}/10
            </span>
            <span className="total-ratings">({photo.total_ratings} ratings)</span>
          </div>
          <SaveButton photoId={photo.id} />
        </div>
      </div>

      {!showRating ? (
        <button onClick={() => setShowRating(true)} className="rate-btn">
          Rate This Photo
        </button>
      ) : (
        <div className="rating-form">
          <div className="rating-slider">
            <input
              type="range"
              min="1"
              max="10"
              value={rating || 5}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <span className="rating-value">{rating || 'Rate'}</span>
          </div>
          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="rating-actions">
            <button onClick={handleRatePhoto} className="submit-btn">Submit</button>
            <button onClick={() => setShowRating(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      <CommentSection photoId={photo.id} />
    </div>
  );
};

export default PhotoCard;
