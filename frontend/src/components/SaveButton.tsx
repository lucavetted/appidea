import React, { useState, useEffect } from 'react';
import { saveService } from '../services/api';
import '../styles/SaveButton.css';

interface SaveButtonProps {
  photoId: number;
  onSaveChange?: (isSaved: boolean) => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ photoId, onSaveChange }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSaveStatus = async () => {
      try {
        const response = await saveService.isSaved(photoId);
        setIsSaved(response.data.isSaved);
      } catch (error) {
        console.error('Error checking save status:', error);
      }
    };

    checkSaveStatus();
  }, [photoId]);

  const handleSaveToggle = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await saveService.unsavePhoto(photoId);
        setIsSaved(false);
      } else {
        await saveService.savePhoto(photoId);
        setIsSaved(true);
      }
      onSaveChange?.(isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`save-btn ${isSaved ? 'saved' : ''}`}
      onClick={handleSaveToggle}
      disabled={loading}
      title={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      {loading ? '...' : isSaved ? 'Saved' : 'Save'}
    </button>
  );
};
