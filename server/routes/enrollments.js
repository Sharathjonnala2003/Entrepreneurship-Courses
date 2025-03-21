import express from "express";
import db from "../database.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Enroll in a course
router.post("/", auth, (req, res) => {
  console.log("Enrollment request received:", req.body);
  const { course_id } = req.body;
  const user_id = req.user.id;

  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  // Check if course exists
  db.get("SELECT id FROM courses WHERE id = ?", [course_id], (err, course) => {
    if (err) {
      console.error("Database error checking course:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    db.get(
      "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
      [user_id, course_id],
      (err, enrollment) => {
        if (err) {
          console.error("Database error checking enrollment:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (enrollment) {
          return res
            .status(400)
            .json({ error: "Already enrolled in this course" });
        }

        // Create new enrollment
        const sql =
          "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";

        db.run(sql, [user_id, course_id], function (err) {
          if (err) {
            console.error("Database error creating enrollment:", err.message);
            return res.status(500).json({ error: "Server error" });
          }

          // Update course enrollment count
          db.run(
            "UPDATE courses SET studentsEnrolled = studentsEnrolled + 1 WHERE id = ?",
            [course_id]
          );

          console.log("Enrollment successful:", {
            id: this.lastID,
            user_id,
            course_id,
          });

          res.status(201).json({
            id: this.lastID,
            user_id,
            course_id,
            enrollment_date: new Date().toISOString(),
            progress: 0,
            completed: 0,
          });
        });
      }
    );
  });
});

// Get all enrollments for current user
router.get("/", auth, (req, res) => {
  const user_id = req.user.id;
  console.log("Fetching enrollments for user:", user_id);

  const sql = `
    SELECT e.id, e.course_id, e.progress, e.completed, e.enrollment_date,
           c.title, c.description, c.category, c.duration, c.price, 
           c.instructor, c.image, c.rating, c.studentsEnrolled 
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ?
    ORDER BY e.enrollment_date DESC
  `;

  db.all(sql, [user_id], (err, enrollments) => {
    if (err) {
      console.error("Database error fetching enrollments:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    console.log(
      `Found ${enrollments.length} enrollments for user ${user_id}:`,
      enrollments.map((e) => ({
        id: e.id,
        course_id: e.course_id,
        title: e.title,
      }))
    );

    res.json(enrollments);
  });
});

// Update enrollment progress
router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { progress, completed } = req.body;
  const user_id = req.user.id;

  // Verify ownership
  db.get(
    "SELECT * FROM enrollments WHERE id = ? AND user_id = ?",
    [id, user_id],
    (err, enrollment) => {
      if (err) {
        console.error("Database error verifying enrollment:", err.message);
        return res.status(500).json({ error: "Server error" });
      }

      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      // Update enrollment
      const sql =
        "UPDATE enrollments SET progress = ?, completed = ? WHERE id = ?";

      db.run(sql, [progress, completed ? 1 : 0, id], function (err) {
        if (err) {
          console.error("Database error updating enrollment:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        res.json({
          ...enrollment,
          progress,
          completed: completed ? 1 : 0,
        });
      });
    }
  );
});

export default router;
