import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobsAppliedFor.css';

function JobsAppliedFor() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/jobs/applied-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching applied jobs');
      }
    };

    fetchAppliedJobs();
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="applied-jobs-container">
      <h2>Jobs Applied For</h2>
      <ul className="applied-job-list">
        {appliedJobs.map((application) => (
          <li key={application._id} className="applied-job-card">
            <h3>{application.jobId.title}</h3>
            <p><strong>Location:</strong> {application.jobId.location}</p>
            <p><strong>Salary:</strong> ${application.jobId.salary}</p>
            <p><strong>Application Date:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
            <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
            <p><strong>Status:</strong> <span className={`status ${application.status.toLowerCase()}`}>{application.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsAppliedFor;
