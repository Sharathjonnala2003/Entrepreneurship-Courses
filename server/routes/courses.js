import express from "express";
import db from "../database.js";
import { auth } from "../middleware/auth.js";
import { validateCourseId } from "../middleware/courseMiddleware.js";

const router = express.Router();

// Debug middleware for this router
router.use((req, res, next) => {
  console.log(`Courses route accessed: ${req.method} ${req.path}`);
  if (req.method !== "GET") {
    console.log("Request body:", req.body);
  }
  if (req.user) {
    console.log("User:", { id: req.user.id, role: req.user.role });
  } else {
    console.log("No authenticated user");
  }
  next();
});

// Get all courses
router.get("/", (req, res) => {
  console.log("Fetching all courses");
  const sql = "SELECT * FROM courses";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    console.log(`Fetched ${rows.length} courses`);

    // Ensure all courses have a status property for client compatibility
    const courses = rows.map((course) => ({
      ...course,
      status: course.status || "active", // Default to active if status is missing
    }));

    res.json(courses);
  });
});

// Get a specific course
router.get("/:id", (req, res) => {
  const courseId = parseInt(req.params.id);

  if (isNaN(courseId)) {
    console.log("Invalid course ID format:", req.params.id);
    return res.status(400).json({ error: "Invalid course ID" });
  }

  console.log(`Fetching course by ID: ${courseId}`);

  const sql = "SELECT * FROM courses WHERE id = ?";
  db.get(sql, [courseId], (err, course) => {
    if (err) {
      console.error("Error fetching course:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    if (!course) {
      console.log(`Course not found with ID: ${courseId}`);
      return res.status(404).json({ error: "Course not found" });
    }

    console.log(`Course found: ${course.title}`);

    // Ensure the course has a status field for backwards compatibility
    if (course.status === undefined) {
      course.status = "active";
    }

    res.json(course);
  });
});

// Create new course (admin only)
router.post("/", auth, (req, res) => {
  // First check if user is admin
  if (!req.user || req.user.role !== "admin") {
    console.log("Non-admin tried to create course:", req.user?.id);
    return res.status(403).json({ error: "Admin access required" });
  }

  console.log("Admin creating course with data:", req.body);

  // Extract and validate course data
  const { title, description, category, duration, price, instructor, image } =
    req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !category ||
    !duration ||
    price === undefined ||
    !instructor
  ) {
    console.error("Missing required fields");
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  // Convert price to number to ensure it's stored correctly
  const coursePrice = Number(price);
  if (isNaN(coursePrice)) {
    return res.status(400).json({ error: "Price must be a valid number" });
  }

  // Use a default image if none provided
  const imageUrl =
    image ||
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

  // Check if 'status' column exists in the courses table
  db.get("PRAGMA table_info(courses)", [], (err, rows) => {
    if (err) {
      console.error("Error checking table schema:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    // Get column names
    db.all("PRAGMA table_info(courses)", [], (err, columns) => {
      if (err) {
        console.error("Error getting columns info:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const columnNames = columns.map((col) => col.name);
      const hasStatusColumn = columnNames.includes("status");

      // Prepare SQL based on schema
      let sql, params;

      if (hasStatusColumn) {
        sql = `
          INSERT INTO courses (
            title, description, category, duration, price, 
            instructor, image, rating, studentsEnrolled, status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        params = [
          title,
          description,
          category,
          duration,
          coursePrice,
          instructor,
          imageUrl,
          0, // Initial rating
          0, // Initial studentsEnrolled
          "active", // Default status
        ];
      } else {
        sql = `
          INSERT INTO courses (
            title, description, category, duration, price, 
            instructor, image, rating, studentsEnrolled
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        params = [
          title,
          description,
          category,
          duration,
          coursePrice,
          instructor,
          imageUrl,
          0, // Initial rating
          0, // Initial studentsEnrolled
        ];
      }

      // Execute the database insert
      db.run(sql, params, function (err) {
        if (err) {
          console.error("Database error creating course:", err.message);
          return res
            .status(500)
            .json({ error: "Error creating course: " + err.message });
        }

        console.log(`Course created with ID: ${this.lastID}`);

        // Return the created course with its ID
        res.status(201).json({
          id: this.lastID,
          title,
          description,
          category,
          duration,
          price: coursePrice,
          instructor,
          image: imageUrl,
          rating: 0,
          studentsEnrolled: 0,
          status: "active", // Always return this for client consistency
        });
      });
    });
  });
});

// Update a course - admin only
router.put("/:id", auth, validateCourseId, (req, res) => {
  // First check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const {
    title,
    description,
    category,
    duration,
    price,
    instructor,
    image,
    rating,
    studentsEnrolled,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !duration ||
    !price ||
    !instructor
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    UPDATE courses
    SET title = ?,
        description = ?,
        category = ?,
        duration = ?,
        price = ?,
        instructor = ?,
        image = ?,
        rating = ?,
        studentsEnrolled = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      title,
      description,
      category,
      duration,
      Number(price),
      instructor,
      image,
      Number(rating) || 0,
      Number(studentsEnrolled) || 0,
      req.params.id,
    ],
    function (err) {
      if (err) {
        console.error("Error updating course:", err.message);
        return res.status(500).json({ error: "Server error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      console.log("Course updated, ID:", req.params.id);
      res.json({
        id: req.params.id,
        title,
        description,
        category,
        duration,
        price: Number(price),
        instructor,
        image,
        rating: Number(rating) || 0,
        studentsEnrolled: Number(studentsEnrolled) || 0,
      });
    }
  );
});

// Delete a course - admin only
router.delete("/:id", auth, validateCourseId, (req, res) => {
  // First check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  console.log("Deleting course with ID:", req.params.id);

  const sql = "DELETE FROM courses WHERE id = ?";

  db.run(sql, [req.params.id], function (err) {
    if (err) {
      console.error("Error deleting course:", err.message);
      return res.status(500).json({ error: "Server error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    console.log("Course deleted successfully");
    res.json({ message: "Course deleted successfully" });
  });
});

export default router;
