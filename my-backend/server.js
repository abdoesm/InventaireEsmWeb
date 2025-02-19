const express = require('express');
const cors = require('cors'); // Enable CORS
const UserDbHelper = require('./UserDbHelper');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require("bcrypt");

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




const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ success: false, message: "Invalid token" });

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

// 🔹 Add New User API
app.post("/api/users", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userAdded = await UserDbHelper.addUser({ username, password: hashedPassword, role });

    if (userAdded) {
      return res.status(201).json({ success: true, message: "User added successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to add user" });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

//update user
app.put("/api/users/:id", verifyToken, async (req, res) => {
  console.log("🔹 Update Request Received:", req.body);
  console.log("🔹 Headers:", req.headers);

  const { id } = req.params;
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ success: false, message: "Username and role are required" });
  }

  try {
    const updated = await UserDbHelper.updateUser({ id, username, role });

    if (updated) {
      return res.json({ success: true, message: "User updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "User not found or update failed" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// Delete User API
app.delete("/api/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await UserDbHelper.deleteUser(id);

    if (deleted) {
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      return res.status(404).json({ success: false, message: "User not found or deletion failed" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});