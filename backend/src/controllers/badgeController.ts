import pool from '../config/database';

export const updateUserBadges = async (userId: number) => {
  try {
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT p.id) as photo_count,
        COUNT(DISTINCT r.id) as rating_count,
        AVG(r.score) as avg_rating,
        COUNT(DISTINCT f.follower_id) as followers_count
      FROM users u
      LEFT JOIN photos p ON u.id = p.user_id
      LEFT JOIN ratings r ON p.id = r.photo_id
      LEFT JOIN follows f ON u.id = f.following_id
      WHERE u.id = $1
      GROUP BY u.id`,
      [userId]
    );

    if (statsResult.rows.length === 0) return;

    const stats = statsResult.rows[0];
    let badge = null;

    if (stats.avg_rating >= 9) {
      badge = 'top_rated';
    } else if (stats.photo_count >= 100) {
      badge = 'photographer';
    } else if (stats.followers_count >= 1000) {
      badge = 'influencer';
    } else if (stats.rating_count >= 500) {
      badge = 'food_critic';
    }

    if (badge) {
      await pool.query(
        'UPDATE users SET badge = $1, is_verified = true WHERE id = $2',
        [badge, userId]
      );
    }
  } catch (error) {
    console.error('Update badges error:', error);
  }
};

export const getBadgeInfo = (badge: string | null) => {
  const badgeInfo: { [key: string]: { label: string; description: string; icon: string } } = {
    top_rated: {
      label: 'Top Rated',
      description: 'Average rating of 9+',
      icon: '⭐',
    },
    photographer: {
      label: 'Photographer',
      description: '100+ photos uploaded',
      icon: '📸',
    },
    influencer: {
      label: 'Influencer',
      description: '1000+ followers',
      icon: '🌟',
    },
    food_critic: {
      label: 'Food Critic',
      description: '500+ ratings given',
      icon: '🍴',
    },
  };

  return badge && badgeInfo[badge] ? badgeInfo[badge] : null;
};
