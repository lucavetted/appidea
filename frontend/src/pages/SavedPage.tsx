import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveService } from '../services/api';
import { SaveButton } from '../components/SaveButton';
import '../styles/Saved.css';

interface Photo {
  id: number;
  photo_url: string;
  caption: string;
  user_id: number;
  username: string;
  average_rating: number;
  total_ratings: number;
}

export const SavedPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  const loadSavedPhotos = async () => {
    setLoading(true);
    try {
      const response = await saveService.getSavedPhotos(10, offset);
      setPhotos((prev) => (offset === 0 ? response.data : [...prev, ...response.data]));
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Error loading saved photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + 10);
    loadSavedPhotos();
  };

  const handlePhotoClick = (photoId: number) => {
    navigate(`/photo/${photoId}`);
  };

  const handlePhotoUnsaved = (photoId: number) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h1>My Saved Photos</h1>
        <p className="saved-count">
          {photos.length === 0 ? 'No saved photos yet' : `${photos.length} saved photos`}
        </p>
      </div>

      {loading && offset === 0 && <div className="loading">Loading saved photos...</div>}

      {photos.length > 0 ? (
        <div className="photos-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div className="photo-image" onClick={() => handlePhotoClick(photo.id)}>
                <img src={photo.photo_url} alt={photo.caption} />
                <div className="photo-overlay">
                  <p className="view-details">View Details</p>
                </div>
              </div>
              <div className="photo-info">
                <p className="caption">{photo.caption}</p>
                <p className="user">by {photo.username}</p>
                <div className="photo-footer">
                  <div className="rating">
                     {photo.average_rating?.toFixed(1) || 'N/A'} ({photo.total_ratings})
                  </div>
                  <SaveButton 
                    photoId={photo.id}
                    onSaveChange={(isSaved) => {
                      if (!isSaved) {
                        handlePhotoUnsaved(photo.id);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h2>No Saved Photos Yet</h2>
            <p>Start exploring and save your favorite photos to view them later!</p>
          </div>
        )
      )}

      {photos.length > 0 && !loading && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
