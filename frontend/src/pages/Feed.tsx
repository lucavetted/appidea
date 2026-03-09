import React, { useState, useEffect } from 'react';
import { photoService } from '../services/api';
import PhotoCard from '../components/PhotoCard';
import AdBanner from '../components/AdBanner';
import '../styles/Feed.css';

const Feed: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const response = await photoService.getPhotos(10, offset);
      setPhotos([...photos, ...response.data]);
      setOffset(offset + 10);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
    setLoading(false);
  };

  return (
    <div className="feed-container">
      <AdBanner position="top" />
      <div className="photos-grid">
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={loadPhotos} className="load-more">
          Load More
        </button>
      )}
      <AdBanner position="bottom" />
    </div>
  );
};

export default Feed;
