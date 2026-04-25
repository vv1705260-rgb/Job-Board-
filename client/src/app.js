import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/jobs';

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    salary: '', description: '', requirements: '', postedBy: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_URL);
      setJobs(res.data);
    } catch (err) {
      console.log('Error fetching jobs. Is backend running?');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '', postedBy: '' });
      setShowForm(false);
      fetchJobs();
      alert('Job posted successfully!');
    } catch (err) {
      alert('Error posting job');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchJobs();
      } catch (err) {
        alert('Error deleting job');
      }
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header>
        <div className="container">
          <div className="nav">
            <h1 className="logo">JobBoard</h1>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Close' : '+ Post a Job'}
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {showForm && (
          <div className="form-card">
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input type="text" placeholder="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
                <input type="text" placeholder="Salary e.g. 5-8 LPA" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                <input type="email" placeholder="Your Email" value={formData.postedBy} onChange={e => setFormData({...formData, postedBy: e.target.value})} required />
              </div>
              <textarea placeholder="Job Description" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
              <textarea placeholder="Requirements" rows="3" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} required></textarea>
              <button type="submit" className="btn-primary">Post Job</button>
            </form>
          </div>
        )}

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by title, company, or location..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <h2 className="section-title">Available Jobs ({filteredJobs.length})</h2>
        
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <p className="no-jobs">No jobs found. Post the first one!</p>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                <p className="company">{job.company}</p>
                <div className="job-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
                <p className="description">{job.description.substring(0, 120)}...</p>
                <div className="job-footer">
                  <span className="date">Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  <button className="btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer>
        <p>JobBoard © 2026 | LEVEL 2 TASK 1 | MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
