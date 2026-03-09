import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import '../styles/Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await userService.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div key={user.id} className="leaderboard-item">
            <span className="rank">#{index + 1}</span>
            {user.avatar_url && <img src={user.avatar_url} alt={user.username} />}
            <span className="username">{user.username}</span>
            <span className="rating">{user.average_rating?.toFixed(1) || 'N/A'}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
