import React, { useState, useEffect } from 'react';
import { searchService } from '../services/api';
import { SaveButton } from '../components/SaveButton';
import { FollowButton } from '../components/FollowButton';
import '../styles/Search.css';

interface User {
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
}

interface Photo {
  id: number;
  photo_url: string;
  caption: string;
  user_id: number;
  username: string;
  average_rating: number;
  total_ratings: number;
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'users' | 'photos'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [trending, setTrending] = useState<Photo[]>([]);
  const [recommended, setRecommended] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadDiscovery = async () => {
      try {
        const [trendingRes, recommendedRes] = await Promise.all([
          searchService.getTrending(10),
          searchService.getRecommended(10),
        ]);
        setTrending(trendingRes.data);
        setRecommended(recommendedRes.data);
      } catch (error) {
        console.error('Error loading discovery:', error);
      }
    };
    loadDiscovery();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      if (searchType === 'users') {
        const response = await searchService.searchUsers(searchQuery);
        setUsers(response.data);
        setPhotos([]);
      } else {
        const response = await searchService.searchPhotos(searchQuery);
        setPhotos(response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Discover</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search users or photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="search-type-selector">
            <label>
              <input
                type="radio"
                value="users"
                checked={searchType === 'users'}
                onChange={(e) => setSearchType(e.target.value as 'users' | 'photos')}
              />
              Users
            </label>
            <label>
              <input
                type="radio"
                value="photos"
                checked={searchType === 'photos'}
                onChange={(e) => setSearchType(e.target.value as 'users' | 'photos')}
              />
              Photos
            </label>
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {loading && <div className="loading">Searching...</div>}

      {hasSearched ? (
        <div className="search-results">
          {searchType === 'users' && users.length > 0 && (
            <div className="results-section">
              <h2>Users ({users.length})</h2>
              <div className="users-grid">
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <img src={user.avatar_url || 'https://via.placeholder.com/80'} alt={user.username} />
                    <h3>{user.username}</h3>
                    <p>{user.bio}</p>
                    <FollowButton userId={user.id} isCurrentUser={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchType === 'photos' && photos.length > 0 && (
            <div className="results-section">
              <h2>Photos ({photos.length})</h2>
              <div className="photos-grid">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-image">
                      <img src={photo.photo_url} alt={photo.caption} />
                      <div className="photo-actions">
                        <SaveButton photoId={photo.id} />
                      </div>
                    </div>
                    <div className="photo-info">
                      <p className="caption">{photo.caption}</p>
                      <p className="user">by {photo.username}</p>
                      <div className="rating">
                        ⭐ {photo.average_rating?.toFixed(1) || 'N/A'} ({photo.total_ratings} ratings)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {((searchType === 'users' && users.length === 0) ||
            (searchType === 'photos' && photos.length === 0)) && (
            <div className="no-results">No results found for "{searchQuery}"</div>
          )}
        </div>
      ) : (
        <div className="discovery-section">
          {trending.length > 0 && (
            <div className="results-section">
              <h2>🔥 Trending This Week</h2>
              <div className="photos-grid">
                {trending.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-image">
                      <img src={photo.photo_url} alt={photo.caption} />
                      <div className="photo-actions">
                        <SaveButton photoId={photo.id} />
                      </div>
                    </div>
                    <div className="photo-info">
                      <p className="caption">{photo.caption}</p>
                      <p className="user">by {photo.username}</p>
                      <div className="rating">
                        ⭐ {photo.average_rating?.toFixed(1) || 'N/A'} ({photo.total_ratings} ratings)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommended.length > 0 && (
            <div className="results-section">
              <h2>✨ Recommended For You</h2>
              <div className="photos-grid">
                {recommended.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-image">
                      <img src={photo.photo_url} alt={photo.caption} />
                      <div className="photo-actions">
                        <SaveButton photoId={photo.id} />
                      </div>
                    </div>
                    <div className="photo-info">
                      <p className="caption">{photo.caption}</p>
                      <p className="user">by {photo.username}</p>
                      <div className="rating">
                        ⭐ {photo.average_rating?.toFixed(1) || 'N/A'} ({photo.total_ratings} ratings)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
