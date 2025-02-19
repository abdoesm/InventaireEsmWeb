const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const SECRET_KEY = process.env.JWT_SECRET ;
db.connect((err) => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});



class UserDbHelper {
  constructor() {}

  async validateLogin(username, password) {
    console.log('validateLogin called');
    const query = 'SELECT id, role FROM user WHERE username = ? AND password = ?';
  
    try {
      const [rows] = await db.promise().execute(query, [username, password]);
  
      if (rows.length > 0) {
        const user = rows[0];
  
        if (!user.role) {
          console.error("⚠️ Role is missing in database for user:", username);
          return { success: false, message: 'User role missing' };
        }
  
        // ✅ Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  
        return { success: true, token, role: user.role };
      }
  
      return { success: false, message: 'Invalid username or password' };
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
  

  

  // ✅ Get username by ID
  async getUserNameById(userId) {
    console.log('getUserNameById called');
    const query = 'SELECT username FROM user WHERE id = ?';
    try {
      const [rows] = await db.promise().execute(query, [userId]);
      return rows.length > 0 ? rows[0].username : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ✅ Get user role by ID
  async getUserRoleById(userId) {
    console.log('getUserRoleById called');
    const query = 'SELECT role FROM user WHERE id = ?';
    try {
      const [rows] = await db.promise().execute(query, [userId]);
      return rows.length > 0 ? rows[0].role : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ✅ Get user ID by username
  async getUserIdByName(username) {
    console.log('getUserIdByName called');
    const query = 'SELECT id FROM user WHERE username = ?';
    try {
      const [rows] = await db.promise().execute(query, [username]);
      return rows.length > 0 ? rows[0].id : -1;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ✅ Add a new user
  async addUser(user) {
    console.log("addUser called");
    const query = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
    
    try {
      // 🔹 Hash password before storing in the database
      const hashedPassword = await bcrypt.hash(user.password, 10);
  
      const [result] = await db.promise().execute(query, [user.username, hashedPassword, user.role]);
      return result.affectedRows > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


async updateUser(user) {
  console.log('updateUser called:', user);
  //if (!user) console.log("sqd")
  
  let query;
  let values;

  try {
    if (user.password && user.password.trim() !== "") {
      // Hash only if a new password is provided and is not empty
      const hashedPassword = await bcrypt.hash(user.password, 10);
      query = 'UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?';
      values = [user.username, hashedPassword, user.role, user.id];
    } else {
      // Update only username and role if password is not provided
      query = 'UPDATE user SET username = ?, role = ? WHERE id = ?';
      values = [user.username, user.role, user.id];
    }

    console.log("Executing query:", query, "with values:", values);

    const [result] = await db.promise().execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

  

  // ✅ Get all users
  async getUsers() {
    console.log('getUsers called');
    const query = 'SELECT id, username, role FROM user ORDER BY id DESC';
    try {
      const [rows] = await db.promise().execute(query);
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ✅ Delete a user
  async deleteUser(userId) {
    console.log('deleteUser called');
    const query = 'DELETE FROM user WHERE id = ?';
    try {
      const [result] = await db.promise().execute(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  
}

module.exports = new UserDbHelper();
