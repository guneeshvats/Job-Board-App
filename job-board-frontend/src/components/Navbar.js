import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, userRole, handleLogout }) {
  const navigate = useNavigate();
  console.log('userRole', userRole);
  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="logo">
        <h1>JobBoard</h1>
      </div>
      <nav className="navbar-links">
        {isAuthenticated ? (
          <>
            {userRole === 'recruiter' ? (
              // Options for Recruiter
              <>
                <Link to="/profile">Profile</Link>
                <Link to="/add-job">Add New Job</Link>
                {/* <Link to="/all-jobs">See All Jobs</Link> */}
                <Link to="/my-jobs">My Listed Jobs</Link>
              </>
            ) : (
              // Options for Job Seeker
              <>
                <Link to="/jobs">Find Jobs</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/jobs-applied">Jobs Applied For</Link>
                
              </>
            )}
            <button onClick={onLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Find Jobs</Link>
            <Link to="/login" className="sign-in">Sign In</Link>
            <button onClick={() => navigate('/signup')} className="get-started">Get Started</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
