import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, ButtonLink, SectionHeader, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

// Hero Section
const HeroSection = styled.section`
  padding: 8rem 0 6rem;
  background: linear-gradient(135deg, var(--background-color) 0%, #e8e9ff 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, rgba(245, 183, 0, 0.2) 0%, rgba(245, 183, 0, 0.1) 100%);
    border-radius: 50%;
    z-index: 0;
    filter: blur(60px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, rgba(26, 26, 64, 0.15) 0%, rgba(26, 26, 64, 0.05) 100%);
    border-radius: 50%;
    z-index: 0;
    filter: blur(60px);
  }

  @media (max-width: 768px) {
    padding: 6rem 0 4rem;
  }
`;

const HeroContainer = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  animation: fadeIn 1s ease;
  
  h1 {
    font-size: 4rem;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    font-weight: 800;
    letter-spacing: -0.03em;
    
    @media (max-width: 768px) {
      font-size: 2.8rem;
    }

    span {
      color: var(--secondary-color);
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0.1em;
        left: 0;
        width: 100%;
        height: 0.1em;
        background-color: var(--secondary-color);
        opacity: 0.3;
        z-index: -1;
      }
    }
  }
  
  p {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    color: var(--dark-gray);
    max-width: 580px;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      margin-left: auto;
      margin-right: auto;
      font-size: 1.1rem;
    }
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const HeroImage = styled.div`
  position: relative;
  animation: fadeIn 1s ease 0.3s both;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: var(--card-shadow);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    
    &:hover {
      transform: scale(1.03) rotate(1deg);
      box-shadow: var(--hover-shadow);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background-color: rgba(245, 183, 0, 0.2);
    border-radius: 16px;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: -20px;
    width: 150px;
    height: 70px;
    background-color: rgba(26, 26, 64, 0.1);
    border-radius: 16px;
    z-index: -1;
  }
`;

const StatsBar = styled.div`
  background-color: white;
  padding: 1.5rem 0;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
`;

const StatsContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const StatItem = styled.div`
  h4 {
    font-size: 2.5rem;
    color: var(--primary-color);
    font-weight: 800;
    margin-bottom: 0.5rem;
    
    span {
      color: var(--secondary-color);
    }
  }
  
  p {
    color: var(--dark-gray);
    font-size: 1rem;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(to bottom, var(--background-color), white);
`;

const FeaturesHeader = styled(SectionHeader)`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2.8rem;
    
    @media (max-width: 768px) {
      font-size: 2.3rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--hover-shadow);
  }
  
  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    font-size: 1.4rem;
  }
  
  p {
    color: var(--dark-gray);
    line-height: 1.6;
    flex-grow: 1;
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: var(--secondary-color);
  width: 70px;
  height: 70px;
  background-color: rgba(245, 183, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Process Section
const ProcessSection = styled.section`
  padding: 6rem 0;
  background-color: var(--background-color);
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ProcessCard = styled.div`
  text-align: center;
  padding: 2rem;
  
  h3 {
    margin: 1rem 0;
    color: var(--primary-color);
    font-size: 1.4rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const ProcessNumber = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 auto;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    width: 100%;
    height: 2px;
    background-color: var(--light-gray);
    z-index: 0;
  }
  
  ${props => props.last && `
    &::after {
      display: none;
    }
  `}
  
  @media (max-width: 768px) {
    &::after {
      display: none;
    }
  }
`;

// Popular Courses Section
const CoursesSection = styled.section`
  padding: 6rem 0;
  background-color: white;
`;

const CoursesPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
`;

const CourseCard = styled.div`
  background-color: var(--background-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.03);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--hover-shadow);
  }
`;

const CourseImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  ${CourseCard}:hover & img {
    transform: scale(1.1);
  }
`;

const CourseContent = styled.div`
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const CourseRating = styled.div`
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  span {
    font-weight: 600;
  }
`;

const CourseTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  color: var(--primary-color);
`;

const CourseDescription = styled.p`
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
`;

const CoursePrice = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.2rem;
`;

const CoursesCTA = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 6rem 0;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 400px;
    height: 400px;
    background-color: rgba(245, 183, 0, 0.1);
    border-radius: 50%;
    z-index: 0;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
`;

const TestimonialCard = styled.div`
  background-color: white;
  padding: 3rem 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  }
  
  &::before {
    content: '"';
    position: absolute;
    top: 15px;
    left: 20px;
    font-size: 5rem;
    color: rgba(245, 183, 0, 0.2);
    font-family: Georgia, serif;
    line-height: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 16px 16px 0 0;
    opacity: 0.8;
  }
`;

const TestimonialImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 0 auto 1.2rem;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

const TestimonialName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  color: var(--primary-color);
`;

const TestimonialRole = styled.p`
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin-bottom: 1.2rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.6rem;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background-color: var(--light-gray);
    border-radius: 3px;
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: var(--dark-gray);
  line-height: 1.7;
  flex-grow: 1;
  font-style: italic;
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 0;
  background: var(--gradient-primary);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.05);
    z-index: 0;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    bottom: -150px;
    right: -50px;
  }
  
  &::after {
    width: 200px;
    height: 200px;
    top: -100px;
    left: 50px;
  }
`;

const CTAContainer = styled(Container)`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FAQSection = styled.section`
  padding: 6rem 0;
  background-color: white;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(var(--light-gray) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const FAQContainer = styled(Container)`
  max-width: 900px;
  position: relative;
  z-index: 1;
`;

const FAQList = styled.div`
  margin-top: 3rem;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  overflow: hidden;
  background: white;
`;

const FAQItem = styled.div`
  margin-bottom: ${props => props.$isOpen ? '0' : '0'};
  border-bottom: 1px solid var(--light-gray);
  background-color: ${props => props.$isOpen ? 'rgba(245, 247, 250, 0.5)' : 'white'};
  transition: background-color 0.3s ease, margin 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  h3 {
    font-size: 1.2rem;
    padding: 1.5rem 2rem;
    margin: 0;
    color: ${props => props.$isOpen ? 'var(--primary-color)' : 'var(--text-color)'};
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: color 0.3s ease, background-color 0.3s ease;
    font-weight: ${props => props.$isOpen ? '600' : '500'};
    
    &:hover {
      background-color: rgba(245, 247, 250, 0.5);
    }
    
    &::after {
      content: '';
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-left: 1rem;
      background-image: ${props => props.$isOpen ?
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%231e3a8a\'%3E%3Cpath d=\'M19 13H5v-2h14v2z\'/%3E%3C/svg%3E")' :
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%231e3a8a\'%3E%3Cpath d=\'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\'/%3E%3C/svg%3E")'};
      background-repeat: no-repeat;
      background-position: center;
      transition: transform 0.3s ease;
      transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    }
  }
  
  p {
    color: var(--dark-gray);
    line-height: 1.7;
    padding: ${props => props.$isOpen ? '0 2rem 1.5rem' : '0 2rem'};
    margin: 0;
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    overflow: hidden;
    transition: all 0.4s ease;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // FAQ state
  const [openFAQ, setOpenFAQ] = useState(1);

  // FAQ toggle function
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // If user is logged in, redirect button should go to dashboard, otherwise to signup
  const getPrimaryActionPath = () => {
    return user ? '/dashboard' : '/signup';
  };

  // FAQ data
  const faqs = [
    {
      question: "What is EntrepreneurHub?",
      answer: "EntrepreneurHub is a premium online learning platform dedicated to helping aspiring and established entrepreneurs develop the skills they need to build successful businesses. Our platform offers comprehensive courses taught by industry experts covering business strategy, marketing, finance, leadership, and more."
    },
    {
      question: "How do the courses work?",
      answer: "Our courses are self-paced and include video lectures, interactive exercises, downloadable resources, and community discussions. Once enrolled, you'll have lifetime access to the course materials. You can learn on your own schedule and track your progress through your personalized dashboard."
    },
    {
      question: "What makes EntrepreneurHub different from other platforms?",
      answer: "EntrepreneurHub focuses exclusively on entrepreneurship education with courses designed by successful business founders and industry experts. We emphasize practical, actionable knowledge that you can immediately apply to your business. Our platform also offers a supportive community of like-minded entrepreneurs and personalized learning paths."
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! Upon completing a course, you'll receive a certificate of completion that you can share on your LinkedIn profile or resume. Our certificates demonstrate your commitment to professional development and entrepreneurial skills."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 30-day money-back guarantee on all our courses. If you're not satisfied with your learning experience within the first 30 days, simply contact our support team for a full refund, no questions asked."
    }
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <h1>Build Your Business <span>Skills</span> With Expert Guidance</h1>
            <p>
              Master the essential entrepreneurial skills with courses designed by successful founders and industry experts. From ideation to scaling, we've got you covered.
            </p>
            <HeroButtons>
              <ButtonLink to={getPrimaryActionPath()} primary>Start Learning Today</ButtonLink>
              <ButtonLink to="/courses" secondary>Explore Courses</ButtonLink>
            </HeroButtons>
          </HeroContent>
          <HeroImage>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" alt="Entrepreneurs collaborating" />
          </HeroImage>
        </HeroContainer>
      </HeroSection>

      <StatsBar>
        <StatsContainer>
          <StatItem>
            <h4>12<span>k</span>+</h4>
            <p>Active Students</p>
          </StatItem>
          <StatItem>
            <h4>50<span>+</span></h4>
            <p>Premium Courses</p>
          </StatItem>
          <StatItem>
            <h4>35<span>+</span></h4>
            <p>Expert Instructors</p>
          </StatItem>
          <StatItem>
            <h4>92<span>%</span></h4>
            <p>Success Rate</p>
          </StatItem>
        </StatsContainer>
      </StatsBar>

      <FeaturesSection id="features">
        <Container>
          <FeaturesHeader>
            <h2>Why Choose EntrepreneurHub</h2>
            <p>Our platform is designed to provide you with the knowledge, tools, and community support you need to succeed in your entrepreneurial journey.</p>
          </FeaturesHeader>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🚀</FeatureIcon>
              <h3>Expert Instructors</h3>
              <p>Learn directly from successful entrepreneurs and industry leaders with proven track records who share their real-world experiences and strategies.</p>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💼</FeatureIcon>
              <h3>Practical Skills</h3>
              <p>Gain hands-on experience through project-based learning, real-world case studies, and actionable templates you can apply immediately.</p>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🌐</FeatureIcon>
              <h3>Global Community</h3>
              <p>Connect with a diverse network of entrepreneurs, mentors, and investors from around the world who share your passion and drive.</p>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📈</FeatureIcon>
              <h3>Flexible Learning</h3>
              <p>Study at your own pace with our on-demand courses, accessible on any device, anytime, anywhere in the world.</p>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🏆</FeatureIcon>
              <h3>Recognized Certificates</h3>
              <p>Earn certificates upon course completion to showcase your newly acquired skills and knowledge to clients and employers.</p>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <h3>Ongoing Support</h3>
              <p>Get assistance whenever you need it through our responsive support team and engage with instructors for personalized guidance.</p>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <ProcessSection>
        <Container>
          <SectionHeader>
            <h2>How It Works</h2>
            <p>Getting started with EntrepreneurHub is simple and straightforward</p>
          </SectionHeader>

          <ProcessGrid>
            <ProcessCard>
              <ProcessNumber>1</ProcessNumber>
              <h3>Create an Account</h3>
              <p>Sign up for free and create your student profile to get started.</p>
            </ProcessCard>

            <ProcessCard>
              <ProcessNumber>2</ProcessNumber>
              <h3>Choose a Course</h3>
              <p>Browse our catalog and select courses that match your goals.</p>
            </ProcessCard>

            <ProcessCard>
              <ProcessNumber>3</ProcessNumber>
              <h3>Learn at Your Pace</h3>
              <p>Access course materials anytime and learn on your schedule.</p>
            </ProcessCard>

            <ProcessCard>
              <ProcessNumber last>4</ProcessNumber>
              <h3>Get Certified</h3>
              <p>Complete the course and receive your certificate of achievement.</p>
            </ProcessCard>
          </ProcessGrid>
        </Container>
      </ProcessSection >

      <CoursesSection>
        <Container>
          <SectionHeader>
            <h2>Popular Courses</h2>
            <p>Discover our most in-demand courses to kickstart your entrepreneurial journey</p>
          </SectionHeader>

          <CoursesPreview>
            <CourseCard>
              <CourseImage>
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Business Strategy" />
              </CourseImage>
              <CourseContent>
                <CourseMeta>
                  <span>Business Strategy</span>
                  <CourseRating>
                    <span>⭐ 4.8</span>
                    <span>(1254)</span>
                  </CourseRating>
                </CourseMeta>
                <CourseTitle>Business Strategy Fundamentals</CourseTitle>
                <CourseDescription>Learn how to develop effective business strategies for sustainable growth in competitive markets.</CourseDescription>
                <CoursePrice>$299</CoursePrice>
                <ButtonLink to="/course/1" primary fullWidth>View Details</ButtonLink>
              </CourseContent>
            </CourseCard>

            <CourseCard>
              <CourseImage>
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Digital Marketing" />
              </CourseImage>
              <CourseContent>
                <CourseMeta>
                  <span>Marketing</span>
                  <CourseRating>
                    <span>⭐ 4.6</span>
                    <span>(987)</span>
                  </CourseRating>
                </CourseMeta>
                <CourseTitle>Digital Marketing Mastery</CourseTitle>
                <CourseDescription>Master digital marketing channels and strategies to acquire and retain customers effectively.</CourseDescription>
                <CoursePrice>$249</CoursePrice>
                <ButtonLink to="/course/2" primary fullWidth>View Details</ButtonLink>
              </CourseContent>
            </CourseCard>

            <CourseCard>
              <CourseImage>
                <img src="https://images.unsplash.com/photo-1559223607-a43f990c095d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Startup Funding" />
              </CourseImage>
              <CourseContent>
                <CourseMeta>
                  <span>Finance</span>
                  <CourseRating>
                    <span>⭐ 4.7</span>
                    <span>(856)</span>
                  </CourseRating>
                </CourseMeta>
                <CourseTitle>Startup Funding & Finance</CourseTitle>
                <CourseDescription>Learn about different funding options and effective financial management for new ventures.</CourseDescription>
                <CoursePrice>$349</CoursePrice>
                <ButtonLink to="/course/3" primary fullWidth>View Details</ButtonLink>
              </CourseContent>
            </CourseCard>
          </CoursesPreview>

          <CoursesCTA>
            <ButtonLink to="/courses" primary>View All Courses</ButtonLink>
          </CoursesCTA>
        </Container >
      </CoursesSection >

      <TestimonialsSection>
        <Container>
          <SectionHeader>
            <h2>What Our Students Say</h2>
            <p>Join thousands of satisfied students who have transformed their entrepreneurial journey with our courses</p>
          </SectionHeader>

          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialImage src="https://randomuser.me/api/portraits/women/1.jpg" alt="Student 1" />
              <TestimonialName>Emily Johnson</TestimonialName>
              <TestimonialRole>E-commerce Founder</TestimonialRole>
              <TestimonialText>
                "EntrepreneurHub has been a game-changer for my business. The strategic marketing course helped me double my customer base in just three months. The instructors are amazing and the community support is invaluable!"
              </TestimonialText>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialImage src="https://randomuser.me/api/portraits/men/2.jpg" alt="Student 2" />
              <TestimonialName>Michael Brown</TestimonialName>
              <TestimonialRole>Tech Startup CEO</TestimonialRole>
              <TestimonialText>
                "After struggling to secure funding for two years, the Startup Funding course gave me the exact framework I needed. Within weeks of applying what I learned, we secured our seed round of $500K. Worth every penny!"
              </TestimonialText>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialImage src="https://randomuser.me/api/portraits/women/3.jpg" alt="Student 3" />
              <TestimonialName>Sarah Lee</TestimonialName>
              <TestimonialRole>Marketing Consultant</TestimonialRole>
              <TestimonialText>
                "The practical approach of these courses sets them apart from other platforms. Instead of just theory, I got actionable templates and strategies that I implemented immediately with my clients, producing real results."
              </TestimonialText>
            </TestimonialCard>
          </TestimonialsGrid>
        </Container >
      </TestimonialsSection >

      <FAQSection>
        <FAQContainer>
          <SectionHeader>
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our platform and courses</p>
          </SectionHeader>
          <FAQList>
            {faqs.map((faq, index) => (
              <FAQItem key={index} $isOpen={openFAQ === index + 1}>
                <h3 onClick={() => toggleFAQ(index + 1)}>{faq.question}</h3>
                <p>{faq.answer}</p>
              </FAQItem>
            ))}
          </FAQList>
        </FAQContainer>
      </FAQSection >

      <CTASection>
        <CTAContainer>
          <h2>Ready to Start Your Entrepreneurial Journey?</h2>
          <p>Join thousands of successful entrepreneurs who have transformed their businesses with our courses.</p>
          <CTAButtons>
            <Button as="a" href={getPrimaryActionPath()} primary>Get Started Today</Button>
            <Button as="a" href="/courses" secondary>Explore All Courses</Button>
          </CTAButtons>
        </CTAContainer>
      </CTASection>
    </>
  )
}

export default LandingPage
