import { Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email: string, code: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Email Verification - Chopped or Not',
      html: `
        <h2>Welcome to Chopped or Not!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #667eea; font-size: 32px; letter-spacing: 2px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't sign up for this account, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const signup = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const result = await pool.query(
      'INSERT INTO users (email, password, username, verification_code, verification_code_expires) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username',
      [email, hashedPassword, username, verificationCode, codeExpires]
    );

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'Signup successful. Verification code sent to your email.',
      user: result.rows[0],
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.email_verified) {
      const verificationCode = generateVerificationCode();
      const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

      await pool.query(
        'UPDATE users SET verification_code = $1, verification_code_expires = $2 WHERE id = $3',
        [verificationCode, codeExpires, user.id]
      );

      await sendVerificationEmail(email, verificationCode);

      return res.status(403).json({
        message: 'Please verify your email first. Verification code sent.',
        requiresVerification: true,
        userId: user.id,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' } as any
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, code } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (!user.verification_code_expires || new Date() > user.verification_code_expires) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    await pool.query(
      'UPDATE users SET email_verified = true, verification_code = NULL, verification_code_expires = NULL WHERE id = $1',
      [userId]
    );

    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: process.env.JWT_EXPIRE || '7d' } as any
    );

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};
