# Chopped or Not

A Tinder-meets-Reddit social rating app where users can post photos and receive feedback from the community.

## Project Structure

```
DEXBOT/
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   ├── migrations/     # Database migrations
│   │   └── index.ts        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── styles/        # CSS files
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── docs/                   # Documentation

```

## Features

### Core Features
- **User Authentication**: Sign up and login with JWT tokens
- **Photo Uploads**: Users can upload photos with captions
- **Rating System**: 1-10 rating scale with optional comments
- **User Profiles**: Customizable profiles with bio and avatar
- **Leaderboard**: Ranking based on average ratings received
- **Messaging**: Real-time messaging between users via Socket.io
- **Ad Support**: Banner ad placement for monetization

### Tech Stack
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, React Router
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Image Storage**: Cloudinary (configured)

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database URL and other credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/chopped_or_not
JWT_SECRET=your_secret_key_here
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/leaderboard` - Get leaderboard

### Photos
- `POST /api/photos` - Upload photo (protected)
- `GET /api/photos` - Get all photos with pagination
- `GET /api/photos/:id` - Get specific photo
- `DELETE /api/photos/:id` - Delete photo (protected)

### Ratings
- `POST /api/ratings` - Create rating (protected)
- `GET /api/ratings` - Get ratings for a photo
- `PUT /api/ratings/:id` - Update rating (protected)
- `DELETE /api/ratings/:id` - Delete rating (protected)

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/:userId` - Get conversation with user (protected)

## Database Schema

### Users Table
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- username (VARCHAR UNIQUE)
- bio (TEXT)
- avatar_url (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Photos Table
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- photo_url (VARCHAR)
- caption (TEXT)
- created_at (TIMESTAMP)

### Ratings Table
- id (SERIAL PRIMARY KEY)
- photo_id (INTEGER FK)
- user_id (INTEGER FK)
- score (INTEGER 1-10)
- comment (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Messages Table
- id (SERIAL PRIMARY KEY)
- sender_id (INTEGER FK)
- recipient_id (INTEGER FK)
- message_text (TEXT)
- read (BOOLEAN)
- created_at (TIMESTAMP)

### Ads Table
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- image_url (VARCHAR)
- link (VARCHAR)
- placement (VARCHAR)
- active (BOOLEAN)
- created_at (TIMESTAMP)

## Configuration

### Environment Variables

**Backend (.env)**
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/chopped_or_not
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```

## Next Steps & Enhancements

1. **Image Upload**: Integrate Cloudinary for actual image uploads
2. **Real-time Messaging**: Complete Socket.io implementation for live chat
3. **Notifications**: Add push notifications for messages and interactions
4. **Search & Filters**: Add photo search and advanced filtering
5. **User Following**: Implement follow system
6. **Hashtags**: Add hashtag support for photos
7. **Payment Integration**: Integrate Stripe for premium features
8. **Mobile App**: React Native version
9. **Analytics**: Track user engagement and ad performance
10. **Content Moderation**: Image verification and NSFW detection

## Development Notes

- All API endpoints require authentication except signup, login, get photos, and get leaderboard
- Photos are immutable once created - users can only delete them
- Each user can only rate each photo once
- Messages use Socket.io for real-time updates (implementation can be enhanced)

## License

MIT
