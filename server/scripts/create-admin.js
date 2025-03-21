import bcrypt from 'bcryptjs';
import db from '../database.js';

// Admin user details
const admin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',  // Change this to a secure password
  role: 'admin'
};

// Hash the password and create the admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    db.get('SELECT id FROM users WHERE email = ?', [admin.email], async (err, user) => {
      if (err) {
        console.error('Error checking for existing admin:', err.message);
        process.exit(1);
      }
      
      if (user) {
        console.log('Admin user already exists');
        process.exit(0);
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      
      // Create the admin user
      const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      
      db.run(sql, [admin.name, admin.email, hashedPassword, admin.role], function(err) {
        if (err) {
          console.error('Error creating admin user:', err.message);
          process.exit(1);
        }
        
        console.log(`Admin user created with ID: ${this.lastID}`);
        console.log('Email:', admin.email);
        console.log('Password:', admin.password);
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
};

// Initialize the database and create admin
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
      process.exit(1);
    }
    
    createAdmin();
  });
});
