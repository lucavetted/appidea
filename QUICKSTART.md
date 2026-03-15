## ⚡ Quick Start Guide - Chopped or Not

### Prerequisites
✅ Node.js v22.14.0+
✅ PostgreSQL 18+
✅ npm or yarn

---

## 🚀 Get Running in 5 Minutes

### Step 1: Backend Setup (2 minutes)
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database URL:
# DATABASE_URL=postgresql://user:password@localhost:5432/chopped_or_not
# JWT_SECRET=your_secret_key
# CLOUDINARY_NAME=your_cloud_name (optional, for image uploads)

# Create database tables
npm run migrate

# Start server
npm run dev
# 🟢 Backend running on http://localhost:5000
```

### Step 2: Frontend Setup (2 minutes)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# 🟢 Frontend running on http://localhost:3000
```

---

## 🎮 Try It Out (1 minute)

### First Time User
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter email, password, username
4. Check backend terminal for verification code
5. Enter code to verify
6. Login and start using the app!

### Test Features Quickly
- **Feed**: Upload a photo, rate it
- **Discover**: Click 🔍 to search
- **Follow**: Find another user, follow them
- **Save**: Save a photo with 🔖
- **Notifications**: Check alerts
- **Profile**: See your badges and stats

---

## 📂 Project Structure

```
backend/          # Express.js server
frontend/         # React application
README.md        # Full documentation
IMPLEMENTATION_SUMMARY.md  # What was built
```

---

## 🔌 Key Features

✅ User Profiles with badges
✅ Photo uploads & ratings
✅ Follow system
✅ Save/favorites
✅ Search & discovery
✅ Real-time notifications
✅ Threaded comments
✅ Leaderboard
✅ Gamification

---

## 🐛 Troubleshooting

### Backend won't start
- PostgreSQL running? `psql -U postgres`
- .env file created? `cp .env.example .env`
- Database URL correct in .env?

### Frontend shows errors
- Backend running? Check http://localhost:5000/api/health
- Try: `cd backend && npm run build`

### Verification code not showing
- Check terminal output when signing up

---

## 📚 Full Documentation

See [README.md](./README.md) for complete details.

---

**Happy rating! 🌟**
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
