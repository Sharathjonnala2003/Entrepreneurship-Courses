import db from "../database.js";

export const validateCourseId = (req, res, next) => {
  const courseId = req.params.id;

  if (!courseId || isNaN(parseInt(courseId))) {
    console.log("Invalid course ID format:", courseId);
    return res.status(400).json({ error: "Invalid course ID" });
  }

  const parsedId = parseInt(courseId);
  console.log(`Validating course ID: ${parsedId}`);

  db.get("SELECT * FROM courses WHERE id = ?", [parsedId], (err, course) => {
    if (err) {
      console.error("Database error in course middleware:", err.message);
      return res.status(500).json({ error: "Server error" });
    }

    if (!course) {
      console.log(`Course not found with ID: ${parsedId}`);
      return res.status(404).json({ error: "Course not found" });
    }

    console.log(`Course found: ${course.title} (ID: ${course.id})`);

    // Fix: Ensure all properties are returned, add default values for missing ones
    if (course.status === undefined) {
      course.status = "active";
    }

    // Attach course to request for use in route handlers
    req.course = course;
    next();
  });
};
