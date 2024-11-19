import React, { useState } from 'react';
import axios from 'axios';
import './AddJob.css';

function AddJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    employmentType: '',
    experienceLevel: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(process.env.REACT_APP_API_URL+'/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Job posted successfully');
    } catch (error) {
      alert(error.response?.data?.msg || 'Error posting job');
    }
  };

  return (
    <div className="add-job-container">
      <h2>Add a New Job</h2>
      <form onSubmit={handleSubmit} className="add-job-form">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          onChange={handleChange}
          value={formData.description}
          required
        ></textarea>
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          value={formData.location}
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          onChange={handleChange}
          value={formData.salary}
          required
        />
        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          required
        >
          <option value="">Select Employment Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Temporary">Temporary</option>
          <option value="Freelance">Freelance</option>
        </select>
        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Experience Level</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
          <option value="Executive">Executive</option>
        </select>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}

export default AddJob;
