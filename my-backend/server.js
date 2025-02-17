const express = require('express');
const cors = require('cors'); // Enable CORS
const UserDbHelper = require('./UserDbHelper');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const isValid = await UserDbHelper.validateLogin(username, password);
    if (isValid) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error); // Log the error
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserDbHelper.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error); // Log the error
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});