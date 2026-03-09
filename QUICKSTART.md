# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL running locally (or accessible)
- npm or yarn

## 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL URL:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/chopped_or_not
JWT_SECRET=dev_secret_key_12345
```

Create database and run migrations:
```bash
npm run migrate
npm run dev
```

Backend will be running at `http://localhost:5000`

## 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Frontend will be running at `http://localhost:3000`

## 3. Test the App

1. Go to http://localhost:3000
2. Click "Sign Up" to create an account
3. Upload a photo
4. Browse other photos and rate them
5. Check the leaderboard
6. Message other users

## Database Setup (One-time)

If you need to set up PostgreSQL:

```sql
CREATE DATABASE chopped_or_not;
```

The migrations will create all tables automatically when you run `npm run migrate`.

## Common Issues

**"Cannot connect to database"**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**"Port 5000 already in use"**
- Change PORT in backend/.env or kill the process using port 5000

**"Port 3000 already in use"**
- Change port using: `PORT=3001 npm start` in frontend

**"CORS error"**
- Ensure backend is running
- Check CORS_ORIGIN in backend/.env

## API Testing

You can test the API using curl or Postman:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","username":"user1"}'

# Get photos
curl http://localhost:5000/api/photos

# Get leaderboard
curl http://localhost:5000/api/users/leaderboard
```

## Next Steps

- Configure Cloudinary for image uploads
- Set up real-time messaging with Socket.io
- Add more advanced filtering and search
- Implement payment system for premium features
- Deploy to production (Heroku, Railway, Vercel)
