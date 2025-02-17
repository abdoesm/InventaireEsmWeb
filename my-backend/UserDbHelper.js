const mysql = require('mysql2');
require('dotenv').config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Use environment variable for host
    user: process.env.DB_USER, // Use environment variable for user
    password: process.env.DB_PASSWORD, // Use environment variable for password
    database: process.env.DB_NAME, // Use environment variable for database name
  });

db.connect((err) => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

class UserDbHelper {
  constructor() {}

  // Validate user login
  async validateLogin(username, password) {
    console.log('validateLogin called');
    const query = 'SELECT id FROM user WHERE username = ? AND password = ?';
    try {
      const [rows] = await db.promise().execute(query, [username, password]);
      if (rows.length > 0) {
        const userId = rows[0].id;
        // Assuming SessionManager is implemented
        // SessionManager.setActiveUserId(userId);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // Get username by ID
  async getUserNameById(userId) {
    logger.info('getUserNameById called');
    const query = 'SELECT username FROM user WHERE id = ?';
    try {
      const [rows] = await db.promise().execute(query, [userId]);
      if (rows.length > 0) {
        return rows[0].username;
      }
      return null;
    } catch (error) {
        console.log(error);
      throw error;
    }
  }

  // Get user role by ID
  async getUserRoleById(userId) {
    logger.info('getUserRoleById called');
    const query = 'SELECT role FROM user WHERE id = ?';
    try {
      const [rows] = await db.promise().execute(query, [userId]);
      if (rows.length > 0) {
        return rows[0].role;
      }
      return null;
    } catch (error) {
        console.log(error);
      throw error;
    }
  }

  // Add a new user
  async addUser(user) {
    logger.info('addUser called');
    const query = 'INSERT INTO user (username, password, role) VALUES (?, ?, ?)';
    try {
      const [result] = await db.promise().execute(query, [user.username, user.password, user.role]);
      return result.affectedRows > 0;
    } catch (error) {
      lconsole.log(error);
      return false;
    }
  }

  // Update an existing user
  async updateUser(user) {
    logger.info('updateUser called');
    const query = 'UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?';
    try {
      const [result] = await db.promise().execute(query, [user.username, user.password, user.role, user.id]);
      return result.affectedRows > 0;
    } catch (error) {
        console.log(error);
      throw error;
    }
  }

  // Get user ID by username
  async getUserIdByName(username) {
    logger.info('getUserIdByName called');
    const query = 'SELECT id FROM user WHERE username = ?';
    try {
      const [rows] = await db.promise().execute(query, [username]);
      if (rows.length > 0) {
        return rows[0].id;
      }
      return -1; // Return -1 if user not found
    } catch (error) {
        console.log(error);
      throw error;
    }
  }

  // Get all users
  async getUsers() {
    logger.info('getUsers called');
    const query = 'SELECT id, username, password, role FROM user ORDER BY id DESC';
    try {
      const [rows] = await db.promise().execute(query);
      return rows;
    } catch (error) {
        console.log(error);
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId) {
    logger.info('deleteUser called');
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