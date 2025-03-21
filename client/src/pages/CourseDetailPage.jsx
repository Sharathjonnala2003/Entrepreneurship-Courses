import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button, ButtonLink } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';
import CourseReviews from '../components/CourseReviews';
import Quiz from '../components/Quiz';
import ResourcesList from '../components/ResourcesList';
import CourseForum from '../components/CourseForum';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const CourseHeader = styled.div`
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 0 4rem;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 4rem 0 2rem;
  }
`;

const CourseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const CategoryBadge = styled.span`
  background-color: var(--primary-color);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

const CourseContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CourseMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const CourseSection = styled.section`
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.4rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }
`;

const CourseFeatures = styled.ul`
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.8rem;
  }
`;

const CurriculumModules = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Module = styled.div`
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  overflow: hidden;
`;

const ModuleHeader = styled.div`
  background-color: var(--light-gray);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ModuleLessons = styled.ul`
  padding: 1.5rem;
  list-style-type: none;
  
  li {
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--medium-gray);
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const CourseSidebar = styled.div``;

const PriceCard = styled.div`
  background-color: var(--background-color);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: sticky;
  top: 100px;
  
  @media (max-width: 992px) {
    position: static;
  }
`;

const PriceHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 2.5rem;
    color: var(--text-color);
  }
`;

const CardFeatures = styled.ul`
  list-style-type: none;
  margin-bottom: 2rem;
  
  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--medium-gray);
  }
`;

const Guarantee = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 5rem 0;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 5rem 0;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  .btn {
    margin-top: 2rem;
  }
`;

const EnrollButton = styled(Button)`
  width: 100%;
  margin-bottom: 1rem;
`;

const EnrollmentMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--dark-gray)'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
`;

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock quiz data for demonstration
  const quizData = {
    title: "Business Strategy Quiz",
    passingScore: 70,
    questions: [
      {
        text: "What is a value proposition?",
        options: [
          "A promise of value to be delivered to customers",
          "The price of your product",
          "A discount offered to new customers",
          "A business model"
        ],
        correctAnswer: 0
      },
      {
        text: "Which analysis tool examines Strengths, Weaknesses, Opportunities, and Threats?",
        options: [
          "PEST Analysis",
          "Porter's Five Forces",
          "SWOT Analysis",
          "Value Chain Analysis"
        ],
        correctAnswer: 2
      },
      {
        text: "What does a competitive advantage give a company?",
        options: [
          "Lower taxes",
          "Edge over its rivals",
          "Better employees",
          "Higher market share only"
        ],
        correctAnswer: 1
      }
    ]
  };

  // Mock resources data
  const resourcesData = [
    {
      id: 1,
      title: "Business Strategy Framework Template",
      description: "A template to help you develop your business strategy",
      type: "pdf",
      size: 2500000,
      url: "https://example.com/resources/strategy-template.pdf"
    },
    {
      id: 2,
      title: "Market Analysis Spreadsheet",
      description: "Excel spreadsheet with formulas for market analysis",
      type: "xls",
      size: 1800000,
      url: "https://example.com/resources/market-analysis.xlsx"
    },
    {
      id: 3,
      title: "Value Proposition Canvas",
      description: "Canvas to help you design compelling value propositions",
      type: "pdf",
      size: 3200000,
      url: "https://example.com/resources/value-proposition.pdf"
    }
  ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching course details for ID:', id);

        // Use the correct API endpoint
        const response = await axios.get(`/courses/${id}`);
        console.log('Course details response:', response.data);

        if (response.data) {
          setCourse(response.data);
        } else {
          setError('Failed to load course details');
        }

        // Check if user is enrolled - fixed API path
        if (user) {
          try {
            const enrollmentsResponse = await axios.get('/enrollments');
            console.log('User enrollments:', enrollmentsResponse.data);

            const isEnrolled = enrollmentsResponse.data.some(
              enrollment => enrollment.course_id === parseInt(id)
            );
            console.log('User is enrolled:', isEnrolled);

            setEnrolled(isEnrolled);
          } catch (enrollError) {
            console.error('Error checking enrollment status:', enrollError);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);

        let errorMessage = 'Failed to load course details';
        if (err.response) {
          console.error('Error response:', err.response.data);
          errorMessage = err.response.data.error || errorMessage;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/course/${id}` } });
      return;
    }

    setEnrolling(true);
    setEnrollmentMessage('');

    try {
      const response = await axios.post('/enrollments', {
        course_id: parseInt(id)
      });

      console.log('Enrollment successful:', response.data);
      setEnrolled(true);
      setEnrollmentMessage('Congratulations! You are now enrolled in this course.');
    } catch (err) {
      console.error('Error enrolling in course:', err);

      let errorMessage = 'Failed to enroll in course. Please try again.';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setEnrollmentMessage(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleQuizComplete = (score) => {
    console.log(`Quiz completed with score: ${score}`);
    // Here you would typically save the score to the database
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingMessage>Loading course details...</LoadingMessage>
        </Container>
      </PageContainer>
    );
  }

  if (error || !course) {
    return (
      <PageContainer>
        <Container>
          <ErrorContainer>
            <h2>Error</h2>
            <p>{error || 'Course not found'}</p>
            <ButtonLink to="/courses" primary>Back to Courses</ButtonLink>
          </ErrorContainer>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <CourseHeader style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${course.image})` }}>
        <Container>
          <h1>{course.title}</h1>
          <CourseMeta>
            <CategoryBadge>{course.category}</CategoryBadge>
            <span>Instructor: {course.instructor}</span>
            <span>Duration: {course.duration}</span>
          </CourseMeta>
        </Container>
      </CourseHeader>

      <Container>
        <CourseContent>
          <CourseMain>
            <TabsContainer>
              <TabsList>
                <Tab
                  $active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Tab>
                <Tab
                  $active={activeTab === 'curriculum'}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Curriculum
                </Tab>
                <Tab
                  $active={activeTab === 'resources'}
                  onClick={() => setActiveTab('resources')}
                >
                  Resources
                </Tab>
                <Tab
                  $active={activeTab === 'quiz'}
                  onClick={() => setActiveTab('quiz')}
                >
                  Practice Quiz
                </Tab>
                <Tab
                  $active={activeTab === 'discussions'}
                  onClick={() => setActiveTab('discussions')}
                >
                  Discussions
                </Tab>
                <Tab
                  $active={activeTab === 'reviews'}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </Tab>
              </TabsList>

              <TabContent $active={activeTab === 'overview'}>
                <CourseSection>
                  <h2>About This Course</h2>
                  <p>{course.description}</p>

                  <h3>What You'll Learn</h3>
                  <CourseFeatures>
                    <li>Develop effective business strategies for competitive advantage</li>
                    <li>Perform market analysis and identify customer needs</li>
                    <li>Create compelling value propositions</li>
                    <li>Execute strategic initiatives successfully</li>
                    <li>Adapt strategies to changing market conditions</li>
                  </CourseFeatures>

                  <h3>Requirements</h3>
                  <CourseFeatures>
                    <li>No prior experience required</li>
                    <li>Basic understanding of business concepts is helpful but not necessary</li>
                    <li>Passion for entrepreneurship and willingness to learn</li>
                  </CourseFeatures>
                </CourseSection>
              </TabContent>

              <TabContent $active={activeTab === 'curriculum'}>
                <CourseSection>
                  <h2>Course Curriculum</h2>
                  <p>This course is structured to provide a comprehensive understanding of business strategy development and implementation.</p>

                  <CurriculumModules>
                    <Module>
                      <ModuleHeader>
                        <h3>Module 1: Strategic Foundations</h3>
                        <span>3 lessons • 2 hours</span>
                      </ModuleHeader>
                      <ModuleLessons>
                        <li>Introduction to Strategic Thinking</li>
                        <li>Understanding Business Models</li>
                        <li>Setting Strategic Objectives</li>
                      </ModuleLessons>
                    </Module>

                    <Module>
                      <ModuleHeader>
                        <h3>Module 2: Market Analysis</h3>
                        <span>4 lessons • 3 hours</span>
                      </ModuleHeader>
                      <ModuleLessons>
                        <li>Market Segmentation</li>
                        <li>Competitive Analysis</li>
                        <li>Customer Needs Assessment</li>
                        <li>Market Sizing and Opportunity</li>
                      </ModuleLessons>
                    </Module>

                    <Module>
                      <ModuleHeader>
                        <h3>Module 3: Value Creation</h3>
                        <span>4 lessons • 3 hours</span>
                      </ModuleHeader>
                      <ModuleLessons>
                        <li>Value Proposition Design</li>
                        <li>Revenue Models</li>
                        <li>Cost Structure Analysis</li>
                        <li>Scaling Strategies</li>
                      </ModuleLessons>
                    </Module>
                  </CurriculumModules>
                </CourseSection>
              </TabContent>

              <TabContent $active={activeTab === 'resources'}>
                <CourseSection>
                  <ResourcesList
                    resources={resourcesData}
                    courseId={id}
                    isEnrolled={enrolled}
                  />
                </CourseSection>
              </TabContent>

              <TabContent $active={activeTab === 'quiz'}>
                <CourseSection>
                  <h2>Practice Quiz</h2>
                  <p>Test your knowledge with this short quiz on business strategy concepts.</p>
                  <Quiz quizData={quizData} onComplete={handleQuizComplete} />
                </CourseSection>
              </TabContent>

              <TabContent $active={activeTab === 'discussions'}>
                <CourseSection>
                  <CourseForum courseId={id} isEnrolled={enrolled} />
                </CourseSection>
              </TabContent>

              <TabContent $active={activeTab === 'reviews'}>
                <CourseSection>
                  {course && <CourseReviews courseId={course.id || course._id || id} />}
                </CourseSection>
              </TabContent>
            </TabsContainer>
          </CourseMain>

          <CourseSidebar>
            <PriceCard>
              <PriceHeader>
                <h3>${course.price}</h3>
              </PriceHeader>
              <CardFeatures>
                <li>✓ Full lifetime access</li>
                <li>✓ Access on mobile and desktop</li>
                <li>✓ Certificate of completion</li>
                <li>✓ Community support</li>
                <li>✓ Project-based learning</li>
              </CardFeatures>

              {enrollmentMessage && (
                <EnrollmentMessage>{enrollmentMessage}</EnrollmentMessage>
              )}

              {enrolled ? (
                <EnrollButton as={Link} to="/dashboard" primary>
                  Go to Dashboard
                </EnrollButton>
              ) : (
                <EnrollButton
                  onClick={handleEnroll}
                  primary
                  disabled={enrolling}
                >
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </EnrollButton>
              )}

              <Guarantee>
                30-Day Money-Back Guarantee
              </Guarantee>
            </PriceCard>
          </CourseSidebar>
        </CourseContent>
      </Container>
    </PageContainer>
  );
};

export default CourseDetailPage;
