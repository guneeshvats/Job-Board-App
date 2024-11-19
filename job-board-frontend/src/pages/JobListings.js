import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../services/api';
import Fuse from 'fuse.js'; // For fuzzy searching
import './JobListings.css';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs().then((response) => {
      setJobs(response.data);
      setFilteredJobs(response.data);
    });
  }, []);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  const handleFilter = () => {
    const fuse = new Fuse(jobs, { keys: ['title'], threshold: 0.3 });
    const titleResults = searchTitle ? fuse.search(searchTitle).map(result => result.item) : jobs;

    const salaryFiltered = titleResults.filter(job => {
      const jobSalary = parseInt(job.salary, 10);
      return (!minSalary || jobSalary >= minSalary) && (!maxSalary || jobSalary <= maxSalary);
    });

    const locationFiltered = salaryFiltered.filter(job =>
      !location || job.location.toLowerCase().includes(location.toLowerCase())
    );

    setFilteredJobs(locationFiltered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTitle, minSalary, maxSalary, location]);

  return (
    <div className="job-listings">
      <h2>Job Listings</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search by job title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Salary"
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={maxSalary}
          onChange={(e) => setMaxSalary(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="job-list">
        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p>{job.description}</p>
            <button onClick={() => handleApply(job._id)} className="apply-now-button">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobListings;
