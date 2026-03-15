# Email Verification Setup Guide

## Overview
Email code verification has been added to the authentication system. Users must verify their email address with a 6-digit code before they can access the app.

## Changes Made

### Backend Changes

#### 1. Database Schema (migrations/index.ts)
Added 3 new columns to the `users` table:
- `email_verified` (BOOLEAN, default: FALSE)
- `verification_code` (VARCHAR(6))
- `verification_code_expires` (TIMESTAMP)

#### 2. Auth Controller (controllers/authController.ts)
- **New Functions:**
  - `generateVerificationCode()` - Generates random 6-digit code
  - `sendVerificationEmail()` - Uses Nodemailer to send verification emails
  - `verifyEmail()` - Validates code and marks email as verified

- **Updated Functions:**
  - `signup()` - Now generates verification code and sends email instead of issuing token
  - `login()` - Checks if email is verified before allowing login

#### 3. Routes (routes/auth.ts)
Added new endpoint:
- `POST /api/auth/verify-email` - Verify email with code

#### 4. Package Dependencies
Installed `nodemailer` package for email sending

### Frontend Changes

#### 1. Signup Page (pages/Signup.tsx)
- Added 2-step flow: signup → email verification
- New state variables: `verificationCode`, `userId`, `step`
- Shows verification code input after signup
- Handles email verification submission

#### 2. Login Page (pages/Login.tsx)
- Added email verification step if account not yet verified
- Prompts unverified users to enter verification code
- Re-sends verification code on login attempt of unverified account

#### 3. API Service (services/api.ts)
Added new method:
- `authService.verifyEmail(userId, code)` - Sends verification code to backend

## Configuration

### 1. Environment Variables
Add to `.env` file in backend folder:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### 2. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character app password in `EMAIL_PASSWORD`

### 3. Alternative Email Providers
To use a different email service, modify the transporter configuration in `controllers/authController.ts`:

```typescript
const transporter = nodemailer.createTransport({
  service: 'your-email-service', // 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Verification Flow

### Signup Flow:
1. User enters username, email, password
2. Backend generates 6-digit code (expires in 10 minutes)
3. Code sent via email
4. Frontend shows verification code input
5. User enters code
6. Backend validates code
7. Email marked as verified, JWT token issued
8. User redirected to feed

### Login Flow:
1. User enters email and password
2. If email not verified:
   - New verification code generated and sent
   - Frontend shows verification code input
   - User enters code from new email
   - Email marked as verified, JWT token issued
3. If email already verified:
   - Standard login with JWT token

## Testing

### Without Email Setup
To test without configuring email:
1. Check backend console logs for generated verification codes
2. Use those codes in the frontend verification step
3. Or temporarily modify `sendVerificationEmail()` to log codes instead of sending

### With Email Setup
1. Signup with valid email address
2. Check email inbox for verification code
3. Enter code in frontend verification form
4. Account should be verified and you'll be logged in

## Security Notes

- Verification codes expire after 10 minutes
- Codes are 6-digit random numbers (~1 million possibilities)
- Codes are stored only in database (not sent in response)
- Backend validates code match and expiration
- Failed verification attempts don't lock accounts

## Database Migration

Before running the app, update your existing database:

```bash
cd backend
npm run migrate
```

This will add the new columns to existing users table (existing users will have `email_verified = false`).
