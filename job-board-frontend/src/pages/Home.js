import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch jobs from the backend
    axios.get(process.env.REACT_APP_API_URL+'/jobs')
      .then(response => setJobs(response.data))
      .catch(error => console.error("Error fetching jobs:", error));
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(location.toLowerCase()) &&
    (!employmentType || job.employmentType === employmentType) &&
    (!experienceLevel || job.experienceLevel === experienceLevel)
  );

  const handleApplyClick = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h2>Find Your Dream Job Today</h2>
        <p>Search through thousands of job listings to find your perfect match</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="City, state, or remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
            <option value="">All Employment Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
            <option value="Freelance">Freelance</option>
          </select>
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
            <option value="">All Experience Levels</option>
            <option value="Entry">Entry</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Executive">Executive</option>
          </select>
          <button>Search</button>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div className="stat">
          <span>10k+</span>
          <p>Active Jobs</p>
        </div>
        <div className="stat">
          <span>5k+</span>
          <p>Companies</p>
        </div>
        <div className="stat">
          <span>2M+</span>
          <p>Job Seekers</p>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs">
        <h3>Featured Jobs</h3>
        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div className="job-card" key={job._id}>
                <h4>{job.title}</h4>
                <p><strong>Company:</strong> {job.company || 'N/A'}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
                <p><strong>Employment Type:</strong> {job.employmentType || 'N/A'}</p>
                <p><strong>Experience Level:</strong> {job.experienceLevel || 'N/A'}</p>
                <button className="apply-button" onClick={() => handleApplyClick(job._id)}>
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p>No jobs found. Try adjusting your search criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
