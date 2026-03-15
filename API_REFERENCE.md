## 📋 Complete API Reference - Chopped or Not

All endpoints require JWT authentication (except signup/login/verify).

Authorization header format:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints (`/api/auth`)

### Signup
```
POST /api/auth/signup
Body: {
  "email": "user@example.com",
  "password": "securepass123",
  "username": "foodie_joe"
}
Response: {
  "id": 1,
  "email": "user@example.com",
  "username": "foodie_joe",
  "message": "Verification code sent to email"
}
```

### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "securepass123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "username": "foodie_joe" }
}
```

### Verify Email
```
POST /api/auth/verify-email
Body: {
  "userId": 1,
  "code": "568059"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Email verified successfully"
}
```

---

## 👤 User Endpoints (`/api/users`)

### Get Profile
```
GET /api/users/profile/:userId
Response: {
  "id": 1,
  "username": "foodie_joe",
  "email": "user@example.com",
  "bio": "Love trying new foods",
  "avatar_url": "https://...",
  "badge": "photographer",
  "is_verified": true,
  "followers_count": 25,
  "following_count": 42
}
```

### Update Profile
```
PUT /api/users/profile
Body: {
  "bio": "Professional food critic",
  "avatar_url": "https://..."
}
Response: { "message": "Profile updated successfully" }
```

### Get Leaderboard
```
GET /api/users/leaderboard
Response: [
  {
    "id": 1,
    "username": "top_rater",
    "rating_count": 250,
    "average_rating": 8.5
  },
  ...
]
```

---

## 🖼️ Photo Endpoints (`/api/photos`)

### Upload Photo
```
POST /api/photos
Body: {
  "photo_url": "https://example.com/food.jpg",
  "caption": "Amazing pizza from Luigi's",
  "file_data": "data:image/jpeg;base64,..." (optional - for Cloudinary)
}
Response: {
  "id": 5,
  "user_id": 1,
  "photo_url": "https://res.cloudinary.com/...",
  "caption": "Amazing pizza",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Photos (Feed)
```
GET /api/photos?limit=10&offset=0
Response: [
  {
    "id": 5,
    "photo_url": "https://...",
    "caption": "Pizza",
    "username": "foodie_joe",
    "user_id": 1,
    "average_rating": 8.5,
    "total_ratings": 12
  },
  ...
]
```

### Get Photo Details
```
GET /api/photos/:photoId
Response: {
  "id": 5,
  "photo_url": "https://...",
  "caption": "Pizza",
  "username": "foodie_joe",
  "average_rating": 8.5,
  "total_ratings": 12
}
```

### Delete Photo
```
DELETE /api/photos/:photoId
Response: { "message": "Photo deleted successfully" }
```

---

## ⭐ Rating Endpoints (`/api/ratings`)

### Create Rating
```
POST /api/ratings
Body: {
  "photo_id": 5,
  "score": 9,
  "comment": "Best pizza I've ever had!"
}
Response: {
  "id": 42,
  "photo_id": 5,
  "user_id": 1,
  "score": 9,
  "comment": "Best pizza!",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Photo Ratings
```
GET /api/ratings?photo_id=5
Response: [
  {
    "id": 42,
    "user_id": 1,
    "username": "foodie_joe",
    "score": 9,
    "comment": "Best pizza!",
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Update Rating
```
PUT /api/ratings/:ratingId
Body: {
  "score": 10,
  "comment": "Actually perfect!"
}
Response: { "message": "Rating updated successfully" }
```

### Delete Rating
```
DELETE /api/ratings/:ratingId
Response: { "message": "Rating deleted successfully" }
```

---

## 💬 Comment Endpoints (`/api/comments`)

### Create Comment
```
POST /api/comments
Body: {
  "photo_id": 5,
  "content": "Where is this from?",
  "parent_comment_id": null (optional - for replies)
}
Response: {
  "id": 15,
  "photo_id": 5,
  "user_id": 1,
  "username": "foodie_joe",
  "content": "Where is this from?",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Photo Comments
```
GET /api/comments?photo_id=5
Response: [
  {
    "id": 15,
    "content": "Where is this from?",
    "username": "foodie_joe",
    "likes_count": 3,
    "reply_count": 2,
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Get Comment Replies
```
GET /api/comments/replies/:commentId
Response: [
  {
    "id": 16,
    "content": "Luigi's on Main St",
    "username": "restaurant_owner",
    "created_at": "2024-01-15T10:35:00Z"
  }
]
```

### Like Comment
```
POST /api/comments/like
Body: { "comment_id": 15 }
Response: { "message": "Comment liked successfully" }
```

---

## 👥 Follow Endpoints (`/api/follows`) ⭐ NEW

### Follow User
```
POST /api/follows/follow
Body: { "following_id": 3 }
Response: {
  "message": "Successfully followed user",
  "following_count": 43
}
```

### Unfollow User
```
POST /api/follows/unfollow
Body: { "following_id": 3 }
Response: {
  "message": "Successfully unfollowed user",
  "following_count": 42
}
```

### Get Followers
```
GET /api/follows/followers/:userId
Response: [
  {
    "id": 2,
    "username": "john_doe",
    "avatar_url": "https://...",
    "bio": "Food enthusiast"
  },
  ...
]
```

### Get Following
```
GET /api/follows/following/:userId
Response: [
  {
    "id": 3,
    "username": "jane_smith",
    "avatar_url": "https://...",
    "bio": "Chef & food blogger"
  },
  ...
]
```

### Check Follow Status
```
GET /api/follows/is-following/:followingId
Response: {
  "isFollowing": true
}
```

---

## 💾 Save Endpoints (`/api/saved`) ⭐ NEW

### Save Photo
```
POST /api/saved/save
Body: { "photo_id": 5 }
Response: { "message": "Photo saved successfully" }
```

### Unsave Photo
```
POST /api/saved/unsave
Body: { "photo_id": 5 }
Response: { "message": "Photo unsaved successfully" }
```

### Get Saved Photos
```
GET /api/saved/saved?limit=10&offset=0
Response: [
  {
    "id": 5,
    "photo_url": "https://...",
    "caption": "Pizza",
    "username": "foodie_joe",
    "average_rating": 8.5,
    "total_ratings": 12,
    "saved_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Check if Photo Saved
```
GET /api/saved/is-saved/:photoId
Response: {
  "isSaved": true
}
```

---

## 🔍 Search Endpoints (`/api/search`) ⭐ NEW

### Search Users
```
GET /api/search/users?query=john
Response: [
  {
    "id": 2,
    "username": "john_doe",
    "avatar_url": "https://...",
    "bio": "Food enthusiast"
  },
  ...
]
```

### Search Photos
```
GET /api/search/photos?query=pizza
Response: [
  {
    "id": 5,
    "photo_url": "https://...",
    "caption": "Best pizza ever",
    "username": "foodie_joe",
    "average_rating": 8.5,
    "total_ratings": 12
  },
  ...
]
```

### Get Trending Photos
```
GET /api/search/trending?limit=20
Response: [
  {
    "id": 5,
    "photo_url": "https://...",
    "caption": "Viral pizza",
    "username": "foodie_joe",
    "average_rating": 9.0,
    "total_ratings": 150,
    "rating_count": 150
  },
  ...
]
```

### Get Recommended Photos
```
GET /api/search/recommended?limit=20
Response: [
  {
    "id": 8,
    "photo_url": "https://...",
    "caption": "Sushi from your favorite chef",
    "username": "chef_jane",
    "average_rating": 8.8,
    "total_ratings": 45
  },
  ...
]
```

---

## 🔔 Notification Endpoints (`/api/notifications`) ⭐ NEW

### Get Notifications
```
GET /api/notifications?limit=20&offset=0
Response: [
  {
    "id": 101,
    "type": "follow",
    "actor_id": 2,
    "actor_username": "john_doe",
    "actor_avatar": "https://...",
    "message": "Started following you",
    "read": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 102,
    "type": "like",
    "actor_username": "jane_smith",
    "photo_caption": "Best pizza ever",
    "read": false,
    "created_at": "2024-01-15T10:35:00Z"
  },
  ...
]
```

### Mark as Read
```
POST /api/notifications/mark-read
Body: { "notificationId": 101 }
Response: { "message": "Notification marked as read" }
```

### Mark All as Read
```
POST /api/notifications/mark-all-read
Response: { "message": "All notifications marked as read" }
```

### Get Unread Count
```
GET /api/notifications/unread-count
Response: {
  "unreadCount": 5
}
```

### Delete Notification
```
DELETE /api/notifications/:notificationId
Response: { "message": "Notification deleted successfully" }
```

---

## 💌 Message Endpoints (`/api/messages`)

### Send Message
```
POST /api/messages
Body: {
  "recipient_id": 3,
  "message_text": "Hey! How's the food scene there?"
}
Response: {
  "id": 200,
  "sender_id": 1,
  "recipient_id": 3,
  "message_text": "Hey! How's the food scene there?",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Conversations
```
GET /api/messages/conversations
Response: [
  {
    "user_id": 3,
    "username": "jane_smith",
    "avatar_url": "https://...",
    "last_message": "Sounds great!",
    "last_message_at": "2024-01-15T10:35:00Z"
  },
  ...
]
```

### Get Conversation with User
```
GET /api/messages/:userId
Response: [
  {
    "id": 200,
    "sender_id": 1,
    "sender_username": "foodie_joe",
    "message_text": "Hey! How's the food scene?",
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

---

## ✨ Real-time Events (Socket.io)

### Join Notification Room
```javascript
socket.emit('join_notifications', userId);
// User will receive: new_notification events
```

### Receive Notification
```javascript
socket.on('new_notification', (data) => {
  // data: { type, actor_id, message }
});
```

### Join Message Room
```javascript
socket.emit('join_room', roomId);
// roomId format: can be any string like "chat_1_3"
```

### Send Message (Real-time)
```javascript
socket.emit('send_message', {
  roomId: 'chat_1_3',
  senderId: 1,
  message: 'Hello!'
});

socket.on('receive_message', (data) => {
  // data: { senderId, message, timestamp }
});
```

---

## 🔄 Common Response Patterns

### Success
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "error": "Descriptive error message"
}
```

### Paginated Response
```json
[
  { "id": 1, ... },
  { "id": 2, ... }
]
```

---

## 🔐 Authentication Errors

```
401 Unauthorized - Missing or invalid JWT token
403 Forbidden - User not verified (email not verified)
404 Not Found - Resource doesn't exist
400 Bad Request - Invalid input data
500 Internal Server Error - Server issue
```

---

## 📝 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "pass123",
    "username": "testuser"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "pass123"
  }'

# Get Feed (with token)
curl -X GET http://localhost:5000/api/photos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📚 Learn More

- See [README.md](./README.md) for feature overview
- See [QUICKSTART.md](./QUICKSTART.md) for setup guide
- See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for what was built

---

**Total Endpoints: 50+** ✨
