# Chopped or Not - Development Guide

This is a full-stack social rating application.

## Project Overview

- **Backend**: Node.js/Express with TypeScript, PostgreSQL, Socket.io
- **Frontend**: React with TypeScript, React Router
- **Architecture**: REST API with real-time messaging

## Getting Started

1. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - Copy `.env.example` to `.env` and configure PostgreSQL
   - `npm run migrate` - Create database tables
   - `npm run dev` - Start server on port 5000

2. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm start` - Start on port 3000

## Key Features to Implement/Enhance

- Photo upload with Cloudinary integration
- Real-time messaging with Socket.io
- User profiles and following system
- Advanced search and filtering
- Payment integration for premium features
- Mobile-responsive design
- Content moderation and safety features
- Analytics and reporting

## File Structure

### Backend (`backend/src/`)
- `index.ts` - Express server with Socket.io setup
- `config/database.ts` - PostgreSQL connection
- `controllers/` - Business logic for each feature
- `routes/` - API endpoint definitions
- `middleware/auth.ts` - JWT authentication
- `migrations/` - Database schema setup

### Frontend (`frontend/src/`)
- `pages/` - Full page components (Login, Feed, Profile, etc.)
- `components/` - Reusable UI components
- `services/api.ts` - API client with axios
- `context/AuthContext.tsx` - Global authentication state
- `styles/` - CSS for each page/component

## Common Tasks

### Adding a new API endpoint
1. Create controller function in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Add API service in `frontend/src/services/api.ts`
4. Create frontend component using the service

### Modifying database schema
1. Update `backend/src/migrations/index.ts`
2. Run `npm run migrate` to apply changes

### Styling changes
- Edit CSS files in `frontend/src/styles/`
- Component styles are organized by feature

## Important Notes

- All protected routes require JWT authentication
- Database uses PostgreSQL - ensure it's running
- Frontend proxies to backend on port 5000 (configured in package.json)
- Real-time features use Socket.io for messaging
- Images should be uploaded to Cloudinary (configure credentials in .env)
