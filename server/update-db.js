import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
    updateDatabase();
  }
});

function updateDatabase() {
  console.log("Checking database schema and updating if necessary...");

  // Check if status column exists in courses table
  db.get("PRAGMA table_info(courses)", [], (err, rows) => {
    if (err) {
      console.error("Error checking table columns:", err.message);
      closeDb();
      return;
    }

    // Check if courses table exists
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='courses'",
      [],
      (err, table) => {
        if (err || !table) {
          console.error("Courses table does not exist:", err?.message);
          closeDb();
          return;
        }

        // Get columns info
        db.all("PRAGMA table_info(courses)", [], (err, columns) => {
          if (err) {
            console.error("Error getting columns info:", err.message);
            closeDb();
            return;
          }

          const columnNames = columns.map((col) => col.name);
          console.log("Existing columns:", columnNames.join(", "));

          const updates = [];

          // Check for missing columns and add them
          if (!columnNames.includes("status")) {
            updates.push(
              addColumn("courses", "status", 'TEXT DEFAULT "active"')
            );
          }

          if (updates.length === 0) {
            console.log("No schema updates needed");
            closeDb();
          } else {
            // Run updates in sequence
            runUpdates(updates, 0);
          }
        });
      }
    );
  });
}

function addColumn(table, column, definition) {
  return function (callback) {
    const sql = `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`;
    console.log(`Adding column: ${sql}`);

    db.run(sql, function (err) {
      if (err) {
        console.error(`Error adding column ${column}:`, err.message);
      } else {
        console.log(`Successfully added column ${column} to ${table}`);
      }
      callback();
    });
  };
}

function runUpdates(updates, index) {
  if (index >= updates.length) {
    console.log("All updates completed");
    closeDb();
    return;
  }

  updates[index](() => {
    runUpdates(updates, index + 1);
  });
}

function closeDb() {
  console.log("Database update complete");
  db.close();
}
