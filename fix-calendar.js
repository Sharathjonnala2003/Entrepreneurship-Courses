import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the DB directory exists
const dbDir = path.join(__dirname, "server/db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("Created database directory at", dbDir);
}

// Connect to SQLite database
const dbPath = path.resolve(__dirname, "server/db/database.sqlite");
console.log("Using database path:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
    process.exit(1);
  } else {
    console.log("Connected to SQLite database at", dbPath);
    createCalendarTable();
  }
});

function createCalendarTable() {
  console.log("Creating calendar_events table...");

  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON");

  // Create the table if it doesn't exist
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
        console.log("✅ calendar_events table created successfully!");
      }

      // Verify table exists
      db.get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='calendar_events'",
        [],
        (err, row) => {
          if (err || !row) {
            console.error(
              "Failed to verify table creation:",
              err ? err.message : "Table not found"
            );
          } else {
            console.log("✅ Verified table exists!");
          }

          db.close();
          console.log("Database connection closed.");
        }
      );
    }
  );
}
