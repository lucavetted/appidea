# Email Verification Testing Guide

## Quick Test Without Email Configuration

If you haven't set up email credentials yet, you can still test the verification flow:

### 1. Check Backend Logs for Codes
When a user signs up, the verification code is printed to the console.

**Backend Console Output Example:**
```
Error sending email: [error details]
Verification code for user: 123456
```

### 2. Frontend Verification Test Flow

**Step 1: Sign Up**
- Go to http://localhost:3000/signup
- Enter:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `password123`
- Click "Sign Up"
- You'll see verification code input field

**Step 2: Get Code from Backend Console**
- Check the terminal running `npm run dev` in backend
- Look for verification code logged (or copy from email if configured)

**Step 3: Enter Code**
- Paste the 6-digit code into the frontend verification input
- Click "Verify Email"
- You should be logged in and redirected to feed

## Test with Email Configured

### Gmail Configuration
1. Enable 2-Factor Auth on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to backend/.env:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```
4. Restart backend: `npm run dev`
5. Sign up again - code will be sent to email

### Other Email Providers
- **Outlook/Hotmail**: service: 'outlook'
- **Yahoo**: service: 'yahoo'
- **SendGrid**: Custom configuration (see nodemailer docs)
- **AWS SES**: Custom configuration

## API Testing with cURL/Postman

### Signup Endpoint
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "testuser"
}
```

**Response:**
```json
{
  "message": "Signup successful. Verification code sent to your email.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser"
  },
  "requiresVerification": true
}
```

### Verify Email Endpoint
```bash
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "userId": 1,
  "code": "123456"
}
```

**Success Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (Invalid Code):**
```json
{
  "error": "Invalid verification code"
}
```

### Login with Unverified Email
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Email Not Verified):**
```json
{
  "message": "Please verify your email first. Verification code sent.",
  "requiresVerification": true,
  "userId": 1
}
```

## Database Verification

Check user verification status in database:

```sql
-- View users and their verification status
SELECT id, username, email, email_verified, verification_code, verification_code_expires 
FROM users;

-- Check specific user
SELECT * FROM users WHERE email = 'test@example.com';
```

## Troubleshooting

### Issue: "Cannot find module 'nodemailer'"
- Run: `npm install nodemailer`
- Run: `npm install --save-dev @types/nodemailer`
- Rebuild: `npm run build`

### Issue: Verification code expires quickly
- Codes expire after 10 minutes
- Request new login to get new code with fresh expiration

### Issue: Email not sending
1. Check `.env` credentials are correct
2. For Gmail: Verify you're using App Password (not regular password)
3. Check backend console for error messages
4. Use terminal output for code when debugging

### Issue: "Status 403" on login
- This is expected for unverified emails
- It means you need to verify first
- Frontend should automatically show verification step

## Production Considerations

1. **Email Service**: Use production-grade service (SendGrid, Mailgun, AWS SES)
2. **Rate Limiting**: Add rate limiting on verify endpoint
3. **Retry Logic**: Implement resend code functionality
4. **Expiration**: Adjust 10-minute expiration as needed
5. **Database**: Ensure verification columns are indexed
6. **Monitoring**: Log verification failures for security monitoring
