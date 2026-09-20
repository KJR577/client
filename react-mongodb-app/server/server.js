if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dno: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Base route to check backend health in browser
app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

// API Route: Save User Data (Matches React POST request)
app.post('/api/users', async (req, res) => {
  try {
    const { name, dno } = req.body;

    if (!name || !dno) {
      return res.status(400).json({ error: 'Please provide both name and door number.' });
    }

    const newUser = new User({ name, dno });
    await newUser.save();

    res.status(201).json({ message: 'User details saved successfully!', data: newUser });
  } catch (error) {
    console.error('Database Save Error:', error);
    res.status(500).json({ error: 'Server error while saving data.' });
  }
});

// API Route: Fetch All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Database Fetch Error:', error);
    res.status(500).json({ error: 'Server error while retrieving data.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});