import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ApplyForJob.css';

function ApplyForJob() {
  const { jobId } = useParams();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(''); // URL input for resume
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCoverLetterChange = (e) => {
    setCoverLetter(e.target.value);
  };

  const handleResumeUrlChange = (e) => {
    setResumeUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(process.env.REACT_APP_API_URL+`/jobs/${jobId}/apply`, { coverLetter, resume: resumeUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Application submitted successfully');
      navigate('/jobs-applied'); // Redirect to a page displaying applied jobs
    } catch (err) {
      setError(err.response?.data?.msg || 'Error submitting application');
    }
  };

  return (
    <div className="apply-for-job-container">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit} className="apply-form">
        <label htmlFor="coverLetter">Cover Letter</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          value={coverLetter}
          onChange={handleCoverLetterChange}
          required
          placeholder="Write your cover letter here"
        />

        <label htmlFor="resumeUrl">Resume URL</label>
        <input
          type="url"
          id="resumeUrl"
          name="resumeUrl"
          value={resumeUrl}
          onChange={handleResumeUrlChange}
          placeholder="Enter a link to your resume (e.g., LinkedIn, Google Drive)"
        />

        <button type="submit" className="submit-application-button">Submit Application</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ApplyForJob;
