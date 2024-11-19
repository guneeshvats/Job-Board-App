import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './JobApplications.css';

function JobApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL+`/jobs/job-applications/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching applications');
      }
    };

    fetchApplications();
  }, [jobId]);

  const updateApplicationStatus = async (applicationId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        process.env.REACT_APP_API_URL+`/jobs/job-applications/${applicationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.msg);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status, statusHistory: [...app.statusHistory, { status, date: new Date() }] } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating application status');
    }
  };

  const updateRecruiterNotes = async (applicationId, notes) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        process.env.REACT_APP_API_URL+`/jobs/job-applications/${applicationId}/notes`,
        { recruiterNotes: notes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.msg);
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, recruiterNotes: notes } : app
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating recruiter notes');
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="applications-container">
      <h2>Applications for Job ID: {jobId}</h2>
      <ul className="application-list">
        {applications.map((app) => (
          <li key={app._id} className="application-card">
            <p><strong>Applicant Name:</strong> {app.userId.name}</p>
            <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
            {app.resume && (
              <p><strong>Resume:</strong> <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
            )}
            <p><strong>Status:</strong> <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span></p>
            <p><strong>Application Date:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>

            {/* Status History */}
            <div className="status-history">
              <h4>Status History:</h4>
              <ul>
                {app.statusHistory.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.status}</strong> on {new Date(entry.date).toLocaleDateString()} {entry.updatedBy && `(Updated by ID: ${entry.updatedBy})`}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiter Notes */}
            <div className="recruiter-notes">
              <label htmlFor={`notes-${app._id}`}><strong>Recruiter Notes:</strong></label>
              <textarea
                id={`notes-${app._id}`}
                value={app.recruiterNotes || ''}
                onChange={(e) => updateRecruiterNotes(app._id, e.target.value)}
                placeholder="Add notes for this applicant"
              />
            </div>

            <div className="status-buttons">
              <button onClick={() => updateApplicationStatus(app._id, 'Accepted')} className="status-button accept">
                Accept
              </button>
              <button onClick={() => updateApplicationStatus(app._id, 'Rejected')} className="status-button reject">
                Reject
              </button>
              <button onClick={() => updateApplicationStatus(app._id, 'Hold')} className="status-button hold">
                Hold
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobApplications;
