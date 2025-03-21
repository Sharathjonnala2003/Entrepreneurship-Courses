import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';

const ReviewsContainer = styled.div`
  margin-top: 2rem;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--primary-color);
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--light-gray);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: var(--dark-gray);
`;

const ReviewDate = styled.div`
  color: var(--medium-gray);
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const ReviewContent = styled.p`
  color: var(--text-color);
  line-height: 1.6;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--dark-gray);
`;

const NoReviewsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--dark-gray);
  background-color: var(--light-gray);
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--dark-gray);
  background-color: var(--light-gray);
  border-radius: 8px;
  margin: 1rem 0;
`;

const ReviewsStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const AverageRating = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1;
  }
  
  small {
    color: var(--dark-gray);
    margin-top: 0.5rem;
  }
`;

const StarRating = styled.div`
  color: var(--secondary-color);
  font-size: 1.5rem;
  margin-top: 0.5rem;
`;

const ReviewItem = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: white;
  margin-bottom: 1rem;
`;

const CourseReviews = ({ courseId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Configure axios with proper base URL
  useEffect(() => {
    // This is a crucial setup to ensure your API calls go to the right place
    // Adjust the base URL according to your backend configuration
    axios.defaults.baseURL = 'http://localhost:5000'; // Update this to your API server URL
  }, []);

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        console.log(`Fetching reviews for course ID: ${courseId}`);

        // Using mock data temporarily since API is returning HTML
        console.log("Using mock data because API is returning HTML");

        // Mock data for development
        const mockReviews = [
          {
            id: 1,
            user: { name: "Jane Smith" },
            rating: 5,
            comment: "This course was incredibly helpful! I learned practical strategies I could apply immediately to my business.",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            user: { name: "Mark Johnson" },
            rating: 4,
            comment: "Great content and well-structured lessons. Would recommend to anyone starting a business.",
            created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ];

        setReviews(mockReviews);

        /* Commented out real API call until backend is ready
        const response = await axios.get(`/api/reviews/course/${courseId}`);
        console.log(`Received response from reviews API:`, response);
        
        // Check if response contains HTML (indicating an error)
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
          console.error('Received HTML instead of JSON data:', response.data.substring(0, 100) + '...');
          throw new Error('Invalid response format. Please check the API endpoint.');
        }
        
        // Check if response.data exists and is in expected format
        if (response.data && response.data.reviews) {
          setReviews(response.data.reviews);
        } else if (Array.isArray(response.data)) {
          // If the response is directly an array of reviews
          setReviews(response.data);
        } else {
          // If structure is unexpected, initialize as empty array
          console.error('Unexpected review data format:', response.data);
          setReviews([]);
        }
        */
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
        // Still set some mock data for better UX during development
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  return (
    <ReviewsContainer>
      <h2>Student Reviews</h2>

      {message.text && (
        <div style={{
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          padding: '1rem',
          borderRadius: '5px',
          marginBottom: '1.5rem'
        }}>
          {message.text}
        </div>
      )}

      {/* Add review section */}
      {user && (
        <ReviewForm
          courseId={courseId}
          userReview={userReview}
          setUserReview={setUserReview}
          submitting={submitting}
          setSubmitting={setSubmitting}
          setMessage={setMessage}
          setReviews={setReviews}
        />
      )}

      {/* Reviews list */}
      {loading ? (
        <LoadingMessage>Loading reviews...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <>
              <ReviewsStats>
                <AverageRating>
                  <span>{calculateAverageRating(reviews).toFixed(1)}</span>
                  <StarRating>{'★'.repeat(Math.round(calculateAverageRating(reviews)))}</StarRating>
                  <small>({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</small>
                </AverageRating>
              </ReviewsStats>

              <ReviewsList>
                {reviews.map((review, index) => (
                  <ReviewCard key={review.id || review._id || index}>
                    <ReviewHeader>
                      <ReviewerName>{review.user?.name || 'Anonymous'}</ReviewerName>
                      <ReviewDate>{formatDate(review.createdAt || review.created_at)}</ReviewDate>
                    </ReviewHeader>
                    <ReviewRating>{'★'.repeat(review.rating)}</ReviewRating>
                    <ReviewContent>{review.comment || review.text}</ReviewContent>
                  </ReviewCard>
                ))}
              </ReviewsList>
            </>
          ) : (
            <NoReviews>No reviews available. Be the first to share your experience!</NoReviews>
          )}
        </>
      )}
    </ReviewsContainer>
  );
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
  return sum / reviews.length;
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

export default CourseReviews;
