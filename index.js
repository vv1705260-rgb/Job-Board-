const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true }, // Full-time, Part-time, Remote
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  postedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// Routes
// 1. Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Post a new job
app.post('/api/jobs', async (req, res) => {
  const job = new Job({
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    type: req.body.type,
    salary: req.body.salary,
    description: req.body.description,
    requirements: req.body.requirements,
    postedBy: req.body.postedBy
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Delete job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Job Board API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
