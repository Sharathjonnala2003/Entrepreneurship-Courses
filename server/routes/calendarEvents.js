import express from "express";
import db from "../database.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Enhanced logging for debugging
router.use((req, res, next) => {
  console.log(`Calendar API called: ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// Get all calendar events for the current user
router.get("/", auth, (req, res) => {
  const user_id = req.user.id;
  console.log(`Fetching calendar events for user ${user_id}`);

  const sql = `
    SELECT ce.*, c.title as course_title
    FROM calendar_events ce
    LEFT JOIN courses c ON ce.course_id = c.id
    WHERE ce.user_id = ?
    ORDER BY ce.start_time ASC
  `;

  db.all(sql, [user_id], (err, events) => {
    if (err) {
      console.error("Database error fetching calendar events:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    console.log(`Found ${events.length} calendar events for user ${user_id}`);
    res.json(events);
  });
});

// Create a new calendar event - Fixed version
router.post("/", auth, (req, res) => {
  try {
    const { title, start, end, courseId, description } = req.body;
    const user_id = req.user.id;

    console.log("Creating calendar event:", {
      title,
      start,
      end,
      courseId,
      description,
    });

    if (!title || !start || !end) {
      return res
        .status(400)
        .json({ error: "Title, start time, and end time are required" });
    }

    // Validate that end time is after start time
    if (new Date(end) <= new Date(start)) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    // Simplified logic - insert directly with null courseId if not provided
    const sql = `
      INSERT INTO calendar_events (
        user_id, course_id, title, description, start_time, end_time
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [user_id, courseId || null, title, description || "", start, end],
      function (err) {
        if (err) {
          console.error("Database error creating calendar event:", err.message);
          return res
            .status(500)
            .json({ error: `Database error: ${err.message}` });
        }

        console.log(`Calendar event created with ID: ${this.lastID}`);

        // Return the created event with ID
        res.status(201).json({
          id: this.lastID,
          user_id,
          course_id: courseId || null,
          title,
          description: description || "",
          start_time: start,
          end_time: end,
          created_at: new Date().toISOString(),
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error in POST /calendar-events:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Update a calendar event
router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, start, end, courseId, description } = req.body;
    const user_id = req.user.id;

    console.log(`Updating calendar event ${id}:`, {
      title,
      start,
      end,
      courseId,
    });

    if (!title || !start || !end) {
      return res
        .status(400)
        .json({ error: "Title, start time, and end time are required" });
    }

    // Check if event exists and belongs to user
    db.get(
      "SELECT id FROM calendar_events WHERE id = ? AND user_id = ?",
      [id, user_id],
      (err, event) => {
        if (err) {
          console.error("Database error checking calendar event:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (!event) {
          return res
            .status(404)
            .json({ error: "Event not found or access denied" });
        }

        // Update the event
        const sql = `
          UPDATE calendar_events
          SET title = ?, description = ?, start_time = ?, end_time = ?, course_id = ?
          WHERE id = ?
        `;

        db.run(
          sql,
          [title, description || "", start, end, courseId || null, id],
          function (err) {
            if (err) {
              console.error(
                "Database error updating calendar event:",
                err.message
              );
              return res.status(500).json({ error: "Server error" });
            }

            console.log(`Calendar event updated: ID ${id}`);

            res.json({
              id: parseInt(id),
              user_id,
              course_id: courseId || null,
              title,
              description: description || "",
              start_time: start,
              end_time: end,
              updated_at: new Date().toISOString(),
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected error in PUT /calendar-events:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Delete a calendar event
router.delete("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log(`Deleting calendar event ${id}`);

    // Check if event exists and belongs to user
    db.get(
      "SELECT id FROM calendar_events WHERE id = ? AND user_id = ?",
      [id, user_id],
      (err, event) => {
        if (err) {
          console.error("Database error checking calendar event:", err.message);
          return res.status(500).json({ error: "Server error" });
        }

        if (!event) {
          return res
            .status(404)
            .json({ error: "Event not found or access denied" });
        }

        // Delete the event
        db.run(
          "DELETE FROM calendar_events WHERE id = ?",
          [id],
          function (err) {
            if (err) {
              console.error(
                "Database error deleting calendar event:",
                err.message
              );
              return res.status(500).json({ error: "Server error" });
            }

            console.log(`Calendar event deleted: ID ${id}`);
            res.json({ message: "Event deleted successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Unexpected error in DELETE /calendar-events:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

export default router;
