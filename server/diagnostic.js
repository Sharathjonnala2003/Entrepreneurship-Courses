import db from "./database.js";

console.log("Running database diagnostics...");

// 1. Check if database file exists
console.log("Checking courses table...");
db.get(
  "SELECT name FROM sqlite_master WHERE type='table' AND name='courses'",
  [],
  (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return;
    }

    if (!result) {
      console.error("❌ Courses table does not exist");
      return;
    }

    console.log("✅ Courses table exists");

    // 2. Check courses count
    db.get("SELECT COUNT(*) as count FROM courses", [], (err, result) => {
      if (err) {
        console.error("Error counting courses:", err.message);
        return;
      }

      console.log(`Found ${result.count} courses in database`);

      // 3. Print the first 5 courses
      if (result.count > 0) {
        db.all("SELECT * FROM courses LIMIT 5", [], (err, rows) => {
          if (err) {
            console.error("Error fetching courses:", err.message);
            return;
          }

          console.log("Sample courses:");
          rows.forEach((course) => {
            console.log(
              `- ID: ${course.id}, Title: ${course.title}, Price: $${course.price}`
            );
          });

          console.log("\nDiagnostic complete!");
        });
      } else {
        console.log("No courses found. Try adding some.");
        console.log("\nDiagnostic complete!");
      }
    });
  }
);
