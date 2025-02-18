const express = require('express');
const cors = require('cors'); // Enable CORS
const UserDbHelper = require('./UserDbHelper');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = process.env.JWT_SECRET; 
// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const loginResult = await UserDbHelper.validateLogin(username, password);

    if (loginResult.success) {
    //  console.log("Login successful. Token generated:", loginResult.token); // 🔹 Debugging
      return res.json({ success: true, token: loginResult.token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});




// 🔹 Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: 'Invalid token' });

    req.user = decoded; // Store user info in request
    next();
  });
};


// 🔹 Protected Route (Example)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Access granted', user: req.user });
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