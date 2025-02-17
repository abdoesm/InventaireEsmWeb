const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Use CORS to allow cross-origin requests from React
app.use(cors());

// Body parser middleware to parse JSON request bodies
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: '192.168.0.79',
  user: 'esm_inv1', // use your MySQL username
  password: '123456789', // use your MySQL password
  database: 'testinv', // replace with your database name
});

db.connect((err) => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Example endpoint to get data from your database
app.get('/', (req, res) => {
    res.json({status:"welcome to inventaire et gestion de stock api"});
  });

// Example endpoint to get data from your database
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body
    
    // Query the database to check if the username and password match any user record
    db.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching data');
      }
      
      if (results.length > 0) {
        // User found
        res.json({ success: true, user: results[0] }); // Send back the user data
      } else {
        // Invalid credentials
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    });
  });
  
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
