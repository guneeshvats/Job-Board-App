import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../services/api';

function Login({ setIsAuthenticated, setUserRole }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData)
      .then((response) => {
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        setUserRole(role);
        setFeedbackMessage('Logged in successfully');
        setFeedbackType('success');
        setTimeout(() => {
          navigate('/'); // Redirect to home or dashboard
        }, 2000);
      })
      .catch((error) => {
        setFeedbackMessage(error.response?.data?.msg || 'Login failed. Please try again.');
        setFeedbackType('error');
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = process.env.REACT_APP_API_URL+'/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Sign in to your account</h2>
        <p>Or <Link to="/signup" className="create-account-link">create a new account</Link></p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="form-options">
          <div>
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
        </div>

        <button type="submit" className="login-button">Sign in</button>
      </form>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className={`feedback-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="divider">Or continue with</div>

      <button onClick={handleGoogleLogin} className="google-login">
        <img src="/path-to-google-icon.png" alt="Google icon" /> Google
      </button>
    </div>
  );
}

export default Login;
