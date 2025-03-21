import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the DB directory exists
const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("Created database directory at", dbDir);
}

// Connect to SQLite database
const dbPath = path.resolve(__dirname, "db/database.sqlite");
console.log("Using database path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
    process.exit(1);
  } else {
    console.log("Connected to SQLite database at", dbPath);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON");

  // Create users table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    function (err) {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table created or already exists");
      }
    }
  );

  // Create courses table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      instructor TEXT NOT NULL,
      image TEXT,
      rating REAL DEFAULT 0,
      studentsEnrolled INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    function (err) {
      if (err) {
        console.error("Error creating courses table:", err.message);
      } else {
        console.log("Courses table created or already exists");
      }
    }
  );

  // Create enrollments table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `,
    function (err) {
      if (err) {
        console.error("Error creating enrollments table:", err.message);
      } else {
        console.log("Enrollments table created or already exists");
      }
    }
  );

  // Create reviews table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `,
    function (err) {
      if (err) {
        console.error("Error creating reviews table:", err.message);
      } else {
        console.log("Reviews table created or already exists");
        createAdminUser();
      }
    }
  );

  // Create calendar_events table with enhanced error handling
  db.run(
    `
    CREATE TABLE IF NOT EXISTS calendar_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `,
    function (err) {
      if (err) {
        console.error("Error creating calendar_events table:", err.message);
      } else {
        console.log("Calendar events table created or already exists");
        // Run a test query to verify the table exists
        db.get(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='calendar_events'",
          [],
          function (err, row) {
            if (err || !row) {
              console.error(
                "Failed to verify calendar_events table:",
                err ? err.message : "Table not found"
              );
            } else {
              console.log("Verified calendar_events table exists");
            }
          }
        );
      }
    }
  );
}

// Create admin user if it doesn't exist
function createAdminUser() {
  const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  };

  // Check if admin exists
  db.get(
    "SELECT id FROM users WHERE email = ?",
    [adminUser.email],
    async (err, user) => {
      if (err) {
        console.error("Error checking admin user:", err.message);
        return;
      }

      if (user) {
        console.log("Admin user already exists");
        createSampleCourses();
      } else {
        try {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(adminUser.password, salt);

          // Create admin
          db.run(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [adminUser.name, adminUser.email, hashedPassword, adminUser.role],
            function (err) {
              if (err) {
                console.error("Error creating admin user:", err.message);
              } else {
                console.log(`Admin user created with ID: ${this.lastID}`);
                console.log("Email:", adminUser.email);
                console.log("Password:", adminUser.password);
              }
              createSampleCourses();
            }
          );
        } catch (error) {
          console.error("Error hashing password:", error);
          createSampleCourses();
        }
      }
    }
  );
}

// Create sample courses if none exist
function createSampleCourses() {
  db.get("SELECT COUNT(*) as count FROM courses", [], (err, result) => {
    if (err) {
      console.error("Error checking courses count:", err.message);
      finishSetup();
      return;
    }

    if (result.count === 0) {
      console.log("Creating sample courses...");

      const sampleCourses = [
        {
          title: "Business Strategy Fundamentals",
          description:
            "Learn the core principles of business strategy including market analysis, competitive positioning, and value creation.",
          category: "Business Strategy",
          duration: "8 weeks",
          price: 299,
          instructor: "Dr. Sarah Johnson",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
          rating: 4.7,
          studentsEnrolled: 1254,
          status: "active",
        },
        {
          title: "Digital Marketing Mastery",
          description:
            "Master digital marketing channels including social media, SEO, email marketing, and paid advertising.",
          category: "Marketing",
          duration: "6 weeks",
          price: 249,
          instructor: "Michael Chen",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          rating: 4.5,
          studentsEnrolled: 987,
          status: "active",
        },
        {
          title: "Startup Funding & Finance",
          description:
            "Everything you need to know about financing your startup, from bootstrapping to venture capital.",
          category: "Finance",
          duration: "5 weeks",
          price: 349,
          instructor: "Robert Williams",
          image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc",
          rating: 4.8,
          studentsEnrolled: 856,
          status: "active",
        },
      ];

      let coursesAdded = 0;

      sampleCourses.forEach((course) => {
        db.run(
          `INSERT INTO courses (
            title, description, category, duration, price, instructor, 
            image, rating, studentsEnrolled, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            course.title,
            course.description,
            course.category,
            course.duration,
            course.price,
            course.instructor,
            course.image,
            course.rating,
            course.studentsEnrolled,
            course.status,
          ],
          function (err) {
            if (err) {
              console.error(
                `Error creating course "${course.title}":`,
                err.message
              );
            } else {
              console.log(
                `Course created: ${course.title} (ID: ${this.lastID})`
              );
            }

            coursesAdded++;
            if (coursesAdded === sampleCourses.length) {
              finishSetup();
            }
          }
        );
      });
    } else {
      console.log(`Database already has ${result.count} courses`);
      finishSetup();
    }
  });
}

function finishSetup() {
  console.log("\nDatabase setup complete!");
  console.log("\nAdmin user credentials:");
  console.log("Email: admin@example.com");
  console.log("Password: admin123");
  console.log("\nYou can now start the application with:");
  console.log("npm run dev");

  // Close the database connection and exit after a delay
  setTimeout(() => {
    db.close();
    process.exit(0);
  }, 1000);
}
