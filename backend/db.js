const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Database file location
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'users.db');

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_email ON users(email);
  `);

  // Password reset tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_token ON password_reset_tokens(token);
  `);

  console.log('Database initialized successfully');
}

// User operations
const userDb = {
  // Create a new user
  create: (username, password, email = null) => {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, password);
    return result.lastInsertRowid;
  },

  // Find user by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Find user by username
  findByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // Find user by email
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  // Update user password
  updatePassword: (userId, newPassword) => {
    const stmt = db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(newPassword, userId);
  },

  // Get all users (admin)
  getAll: () => {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users');
    return stmt.all();
  },

  // Delete user
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }
};

// Password reset token operations
const tokenDb = {
  // Create password reset token
  create: (userId, token, expiresAt) => {
    const stmt = db.prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)');
    const result = stmt.run(userId, token, expiresAt);
    return result.lastInsertRowid;
  },

  // Find token
  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT * FROM password_reset_tokens 
      WHERE token = ? AND used = 0 AND expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(token);
  },

  // Mark token as used
  markAsUsed: (token) => {
    const stmt = db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE token = ?');
    return stmt.run(token);
  },

  // Delete expired tokens (cleanup)
  deleteExpired: () => {
    const stmt = db.prepare('DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP OR used = 1');
    return stmt.run();
  }
};

// Initialize database on require
initializeDatabase();

module.exports = {
  db,
  userDb,
  tokenDb
};
