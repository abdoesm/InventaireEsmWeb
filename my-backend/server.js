const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserDbHelper = require('./UserDbHelper');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Use environment variable for security

// ✅ Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid Token' });

    req.user = user; // Attach user data to request
    next();
  });
};

// ✅ Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const result = await UserDbHelper.validateLogin(username, password);

    if (result.success) {
      res.json(result); // Send token and role to frontend
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get all users (Protected Route)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await UserDbHelper.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// ✅ Dashboard route (Example protected route)
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ success: true, message: `Welcome to the dashboard, ${req.user.role}!` });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
