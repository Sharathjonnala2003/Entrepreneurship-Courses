import express from 'express';
import db from '../database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create or update a review
router.post('/', auth, (req, res) => {
  const { course_id, rating, comment } = req.body;
  const user_id = req.user.id;
  
  if (!course_id || !rating) {
    return res.status(400).json({ error: 'Course ID and rating are required' });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  // Check if course exists
  db.get('SELECT id FROM courses WHERE id = ?', [course_id], (err, course) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if user is enrolled in this course
    db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', 
      [user_id, course_id], 
      (err, enrollment) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }
        
        if (!enrollment) {
          return res.status(403).json({ error: 'You must be enrolled in the course to review it' });
        }
        
        // Check if user already reviewed this course
        db.get('SELECT id FROM reviews WHERE user_id = ? AND course_id = ?', 
          [user_id, course_id], 
          (err, existingReview) => {
            if (err) {
              return res.status(500).json({ error: 'Server error' });
            }
            
            if (existingReview) {
              // Update existing review
              const updateSql = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?';
              
              db.run(updateSql, [rating, comment || '', existingReview.id], function(err) {
                if (err) {
                  return res.status(500).json({ error: 'Server error' });
                }
                
                // Update course average rating
                updateCourseRating(course_id);
                
                res.json({
                  id: existingReview.id,
                  user_id,
                  course_id,
                  rating,
                  comment,
                  updated: true
                });
              });
            } else {
              // Create new review
              const insertSql = 'INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)';
              
              db.run(insertSql, [user_id, course_id, rating, comment || ''], function(err) {
                if (err) {
                  return res.status(500).json({ error: 'Server error' });
                }
                
                // Update course average rating
                updateCourseRating(course_id);
                
                res.status(201).json({
                  id: this.lastID,
                  user_id,
                  course_id,
                  rating,
                  comment,
                  created_at: new Date().toISOString()
                });
              });
            }
          }
        );
      }
    );
  });
});

// Get reviews for a course
router.get('/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  
  const sql = `
    SELECT r.*, u.name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.course_id = ?
    ORDER BY r.created_at DESC
  `;
  
  db.all(sql, [courseId], (err, reviews) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    
    res.json(reviews);
  });
});

// Helper function to update course average rating
function updateCourseRating(courseId) {
  const sql = 'SELECT AVG(rating) as avgRating FROM reviews WHERE course_id = ?';
  
  db.get(sql, [courseId], (err, result) => {
    if (!err && result) {
      const updateSql = 'UPDATE courses SET rating = ? WHERE id = ?';
      db.run(updateSql, [result.avgRating || 0, courseId]);
    }
  });
}

export default router;
