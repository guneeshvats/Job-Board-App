import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import AddJob from './pages/AddJob';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import ApplyForJob from './pages/ApplyForJob';
import JobsAppliedFor from './pages/JobsAppliedFor';
import OAuthRedirect from './components/OAuthRedirect';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        {/* Root Route */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Home />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />

        {/* Protected Routes */}
        <Route path="/jobs" element={isAuthenticated ? <JobListings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Recruiter-specific Routes */}
        <Route path="/add-job" element={isAuthenticated && userRole === 'recruiter' ? <AddJob /> : <Navigate to="/login" />} />
        <Route path="/my-jobs" element={isAuthenticated && userRole === 'recruiter' ? <MyJobs /> : <Navigate to="/login" />} />
        <Route path="/job-applications/:jobId" element={isAuthenticated && userRole === 'recruiter' ? <JobApplications /> : <Navigate to="/login" />} />
        
        {/* Job Seeker-specific Routes */}
        <Route path="/apply/:jobId" element={isAuthenticated && userRole === 'job_seeker' ? <ApplyForJob /> : <Navigate to="/login" />} />
        <Route path="/jobs-applied" element={isAuthenticated && userRole === 'job_seeker' ? <JobsAppliedFor /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
