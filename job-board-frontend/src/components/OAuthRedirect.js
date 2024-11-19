import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthRedirect({ setIsAuthenticated, setUserRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token already exists in local storage to prevent double execution
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('role') || "job_seeker"); // Set role from localStorage if available
      navigate('/profile'); // Redirect to profile if already authenticated
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const role = "job_seeker"; // Hardcoded role for job seekers

    if (token) {
      // Store token and role in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      setIsAuthenticated(true);
      setUserRole(role);

      // Redirect to profile page
      navigate('/profile');
    } else {
      // Redirect to login if token is missing
      navigate('/login');
    }
  }, [navigate, setIsAuthenticated, setUserRole]);

  return <p>Redirecting...</p>;
}

export default OAuthRedirect;
