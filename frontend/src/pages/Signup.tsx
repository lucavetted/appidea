import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signup(email, password, username);
      setUserId(response.data.user.id);
      setStep('verify');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    try {
      const response = await authService.verifyEmail(userId, verificationCode);
      login(response.data.user, response.data.token);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    }
  };

  if (step === 'verify') {
    return (
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleVerifyEmail}>
          <h1>Verify Email</h1>
          <p>We sent a verification code to {email}</p>
          {error && <div className="error">{error}</div>}
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit">Verify Email</button>
          <p>
            <a href="#" onClick={() => setStep('signup')}>Back to Sign Up</a>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
