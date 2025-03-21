import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  background-color: var(--light-gray);
  padding: 3rem 0;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  p {
    color: var(--dark-gray);
    max-width: 700px;
  }
`;

const DashboardSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--light-gray);
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--hover-shadow);
  }
`;

const CourseImage = styled.div`
  height: 180px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CourseContent = styled.div`
  padding: 1.5rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const CourseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--light-gray);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: var(--secondary-color);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-size: 0.85rem;
  color: var(--dark-gray);
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--dark-gray);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--dark-gray);
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const CourseActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DashboardPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching enrolled courses for dashboard...');

        // FIX: Use the correct API endpoint without /api prefix since axios is already configured
        // with the base URL in main.jsx
        const response = await axios.get('/enrollments');

        console.log('Enrollments data received:', response.data);
        setEnrolledCourses(response.data);
      } catch (err) {
        console.error('Error fetching enrollments:', err);

        // Enhanced error logging
        if (err.response) {
          console.error('Error status:', err.response.status);
          console.error('Error data:', err.response.data);
        } else if (err.request) {
          console.error('No response received from server');
        }

        setError('Failed to fetch your enrolled courses. ' +
          (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const updateProgress = async (enrollmentId, newProgress, completed = false) => {
    try {
      // Remove the /api prefix since it's in baseURL
      await axios.put(`/enrollments/${enrollmentId}`, {
        progress: newProgress,
        completed
      });

      // Update local state
      setEnrolledCourses(prev => prev.map(course =>
        course.id === enrollmentId
          ? { ...course, progress: newProgress, completed: completed ? 1 : 0 }
          : course
      ));
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Container>
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.name}! Track your progress and continue learning.</p>
        </Container>
      </PageHeader>

      <Container>
        <DashboardSection>
          <SectionTitle>My Enrolled Courses</SectionTitle>

          {loading ? (
            <LoadingMessage>Loading your courses...</LoadingMessage>
          ) : error ? (
            <EmptyMessage>{error}</EmptyMessage>
          ) : enrolledCourses.length === 0 ? (
            <EmptyMessage>
              <p>You haven't enrolled in any courses yet.</p>
              <Button as={Link} to="/courses" primary>Browse Courses</Button>
            </EmptyMessage>
          ) : (
            <CoursesGrid>
              {enrolledCourses.map(course => (
                <CourseCard key={course.id}>
                  <CourseImage>
                    <img src={course.image} alt={course.title} />
                  </CourseImage>
                  <CourseContent>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseInfo>
                      <span>Instructor: {course.instructor}</span>
                      <span>{course.duration}</span>
                    </CourseInfo>

                    <ProgressBar>
                      <ProgressFill progress={course.progress} />
                    </ProgressBar>
                    <ProgressText>
                      <span>{course.progress}% complete</span>
                      <span>{course.completed ? 'Completed' : 'In Progress'}</span>
                    </ProgressText>

                    <CourseActions>
                      <Button
                        as={Link}
                        to={`/course/${course.course_id}`}
                        primary
                        style={{ flex: 1 }}
                      >
                        {course.progress === 0 ? 'Start Course' : 'Continue Learning'}
                      </Button>

                      {course.completed === 1 && (
                        <Button
                          as={Link}
                          to={`/certificate/${course.course_id}`}
                          secondary
                        >
                          Certificate
                        </Button>
                      )}
                    </CourseActions>
                  </CourseContent>
                </CourseCard>
              ))}
            </CoursesGrid>
          )}
        </DashboardSection>
      </Container>
    </PageContainer>
  );
};

export default DashboardPage;
