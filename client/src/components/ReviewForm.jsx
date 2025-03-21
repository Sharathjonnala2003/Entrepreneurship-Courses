import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button } from '../styles/CommonStyles';

const FormContainer = styled.div`
  background-color: var(--light-gray);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Star = styled.span`
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.active ? 'var(--secondary-color)' : 'var(--medium-gray)'};
  
  &:hover {
    color: var(--secondary-color);
  }
`;

const TextField = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 5px;
  margin-bottom: 1rem;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${props => props.isError ? '#dc3545' : '#28a745'};
`;

const ReviewForm = ({ courseId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await axios.post('/api/reviews', {
        course_id: courseId,
        rating,
        comment
      });

      setMessage('Review submitted successfully!');
      setRating(0);
      setComment('');

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Write a Review</FormTitle>
      <form onSubmit={handleSubmit}>
        <StarsContainer>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              active={star <= rating}
              onClick={() => setRating(star)}
            >
              ★
            </Star>
          ))}
        </StarsContainer>

        <TextField
          placeholder="Write your review here (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          type="submit"
          primary
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>

        {error && <Message isError>{error}</Message>}
        {message && <Message>{message}</Message>}
      </form>
    </FormContainer>
  );
};

export default ReviewForm;
