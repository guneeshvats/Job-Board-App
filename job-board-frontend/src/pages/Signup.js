import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'job_seeker', // Default role; could be 'recruiter' as well
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData)
      .then(() => {
        setFeedbackMessage('User registered successfully');
        setFeedbackType('success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((error) => {
        setFeedbackMessage(error.response?.data?.msg || 'Registration failed. Please try again.');
        setFeedbackType('error');
      });
  };

  const handleGoogleSignup = () => {
    window.location.href = process.env.REACT_APP_API_URL+'/auth/google';
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="job_seeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} />
        <input type="text" name="streetAddress" placeholder="Street Address" onChange={handleChange} value={formData.streetAddress} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} value={formData.city} />
        <input type="text" name="state" placeholder="State" onChange={handleChange} value={formData.state} />
        <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} value={formData.zipCode} />
        <input type="text" name="country" placeholder="Country" onChange={handleChange} value={formData.country} />
        <button type="submit" className="signup-button">Register</button>
      </form>

      {feedbackMessage && (
        <div className={`feedback-message ${feedbackType}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="divider">Or</div>
      <button onClick={handleGoogleSignup} className="google-signup">
        Sign Up with Google
      </button>
    </div>
  );
}

export default Signup;
