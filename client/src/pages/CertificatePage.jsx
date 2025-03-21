import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import Certificate from '../components/Certificate';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const NotCompletedContainer = styled.div`
  background-color: var(--light-gray);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
  
  h3 {
    margin-bottom: 0.5rem;
  }
`;

const ProgressBar = styled.div`
  height: 10px;
  background-color: var(--light-gray);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: var(--secondary-color);
  border-radius: 5px;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`;

const CertificatePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get course details
        const courseResponse = await axios.get(`/courses/${courseId}`);
        setCourse(courseResponse.data);
        console.log('Course data fetched:', courseResponse.data);

        // Get enrollment details - fixed API path
        const enrollmentsResponse = await axios.get('/enrollments');
        console.log('All enrollments:', enrollmentsResponse.data);

        const foundEnrollment = enrollmentsResponse.data.find(
          e => e.course_id === parseInt(courseId)
        );

        console.log('Found enrollment for this course:', foundEnrollment);
        setEnrollment(foundEnrollment || null);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Response error data:', error.response.data);
          console.error('Response error status:', error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleUpdateProgress = async (progress) => {
    try {
      const completed = progress === 100;

      // Remove the /api prefix
      await axios.put(`/enrollments/${enrollment.id}`, {
        progress,
        completed
      });

      // Update local state
      setEnrollment({
        ...enrollment,
        progress,
        completed: completed ? 1 : 0
      });

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>Loading...</LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  if (!course || !enrollment) {
    return (
      <PageContainer>
        <Container>
          <NotCompletedContainer>
            <h2>Course Not Found</h2>
            <p>You are either not enrolled in this course or the course does not exist.</p>
            <Button as={Link} to="/dashboard" primary>Go to Dashboard</Button>
          </NotCompletedContainer>
        </Container>
      </PageContainer>
    );
  }

  // For demonstration, we're setting a completion date if the course is completed
  // In a real application, you would store this in the database
  const completionDate = enrollment.completed ? new Date().toISOString() : null;

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>Course Certificate</h1>
          <p>{course.title}</p>
        </PageHeader>

        {enrollment.completed ? (
          <Certificate
            userName={user.name}
            courseName={course.title}
            completionDate={completionDate}
            courseInstructor={course.instructor}
          />
        ) : (
          <NotCompletedContainer>
            <h2>Course Not Completed</h2>
            <p>You need to complete this course to receive your certificate.</p>

            <ProgressContainer>
              <h3>Your Progress</h3>
              <ProgressBar>
                <ProgressFill progress={enrollment.progress} />
              </ProgressBar>
              <ProgressText>
                <span>{enrollment.progress}% Complete</span>
                <span>100% Required</span>
              </ProgressText>
            </ProgressContainer>

            {/* For demo purposes, buttons to update progress */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <Button
                secondary
                onClick={() => handleUpdateProgress(Math.min(enrollment.progress + 25, 100))}
              >
                Progress +25%
              </Button>
              <Button
                primary
                onClick={() => handleUpdateProgress(100)}
              >
                Mark as Completed
              </Button>
            </div>

            <Button
              as={Link}
              to={`/course/${courseId}`}
              style={{ marginTop: '2rem' }}
            >
              Return to Course
            </Button>
          </NotCompletedContainer>
        )}
      </Container>
    </PageContainer>
  );
};

export default CertificatePage;
