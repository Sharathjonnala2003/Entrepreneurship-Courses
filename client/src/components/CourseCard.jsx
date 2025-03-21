import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, ButtonLink, Alert } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';
import OptimizedImage from './OptimizedImage';
import usePerformance from '../hooks/usePerformance';

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
  }
`;

const CardImage = styled.div`
  height: 180px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const Category = styled.span`
  background-color: var(--light-gray);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const Title = styled.h3`
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  color: var(--text-color);
`;

const Description = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Instructor = styled.span`
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  
  span {
    margin-left: 0.5rem;
    color: var(--dark-gray);
    font-size: 0.9rem;
    
    &:first-child {
      color: var(--secondary-color);
      margin-left: 0;
    }
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.danger ? 'rgba(220, 53, 69, 0.1)' : 'rgba(13, 110, 253, 0.1)'};
  color: ${props => props.danger ? '#dc3545' : '#0d6efd'};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.danger ? 'rgba(220, 53, 69, 0.2)' : 'rgba(13, 110, 253, 0.2)'};
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.danger ? 'rgba(220, 53, 69, 0.3)' : 'rgba(13, 110, 253, 0.3)'};
  }
`;

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
  </svg>
);

const CourseCard = ({ course, onDelete }) => {
  const { isAdmin } = useAuth();
  const { renderCount } = usePerformance('CourseCard');

  // Ensure we have valid data even if some properties are missing
  const courseData = {
    id: course?.id || 0,
    title: course?.title || 'Untitled Course',
    description: course?.description || 'No description available',
    price: course?.price || 0,
    category: course?.category || 'Uncategorized',
    instructor: course?.instructor || 'Unknown Instructor',
    rating: course?.rating || 0,
    image: course?.image || 'https://via.placeholder.com/300x200?text=No+Image',
    status: course?.status || 'active'
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${courseData.title}"?`)) {
      try {
        if (onDelete) {
          onDelete(courseData.id);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <Card>
      <CardImage>
        <OptimizedImage
          src={courseData.image}
          alt={courseData.title}
          height="180px"
          borderRadius="10px 10px 0 0"
        />
      </CardImage>
      <CardContent>
        <CardHeader>
          <Category>{courseData.category}</Category>
          <Price>${courseData.price}</Price>
        </CardHeader>
        <Title>{courseData.title}</Title>
        <Description>{courseData.description}</Description>
        <CardFooter>
          <Instructor>By {courseData.instructor}</Instructor>
          <Rating>
            <span>⭐</span>
            <span>{courseData.rating.toFixed(1)}</span>
          </Rating>
        </CardFooter>
        <CardActions>
          <Button
            as={Link}
            to={`/course/${courseData.id}`}
            primary
            style={{ flex: 1 }}
          >
            View Course
          </Button>

          {isAdmin && (
            <ActionButtonsWrapper>
              <IconButton
                as={Link}
                to={`/edit-course/${courseData.id}`}
                aria-label="Edit course"
                title="Edit course"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                danger
                aria-label="Delete course"
                title="Delete course"
              >
                <DeleteIcon />
              </IconButton>
            </ActionButtonsWrapper>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
