import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile(user.id);
      setProfile(response.data);
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await userService.updateProfile({ bio });
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt={profile.username} className="avatar" />
        )}
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>{profile.email}</p>
        </div>
      </div>

      <div className="profile-bio">
        {editing ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
            <button onClick={handleUpdateProfile}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>{profile.bio || 'No bio yet'}</p>
            <button onClick={() => setEditing(true)}>Edit Bio</button>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Profile;
