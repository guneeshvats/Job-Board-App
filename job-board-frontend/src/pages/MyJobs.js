import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyJobs.css';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(process.env.REACT_APP_API_URL+'/jobs/my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    };
    fetchJobs();
  }, []);

  const handleSeeApplicants = (jobId) => {
    navigate(`/job-applications/${jobId}`);
  };

  return (
    <div className="my-jobs-container">
      <h2>My Posted Jobs</h2>
      <ul className="job-list">
        {jobs.map((job) => (
          <li key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            <p><strong>Employment Type:</strong> {job.employmentType || 'N/A'}</p>
            <p><strong>Experience Level:</strong> {job.experienceLevel || 'N/A'}</p>
            <button onClick={() => handleSeeApplicants(job._id)} className="see-applicants-button">
              See All Applicants
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyJobs;
