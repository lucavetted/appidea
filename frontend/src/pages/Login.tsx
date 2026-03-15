import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      if (response.status === 403) {
        setStep('verify');
        setError('');
      } else {
        login(response.data.user, response.data.token);
        navigate('/feed');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setUserId(err.response.data.userId);
        setStep('verify');
        setError('');
      } else {
        setError(err.response?.data?.error || 'Invalid email or password');
      }
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
            <a href="#" onClick={() => setStep('login')}>Back to Login</a>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
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
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
