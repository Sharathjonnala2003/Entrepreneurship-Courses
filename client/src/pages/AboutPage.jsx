import React from 'react';
import styled from 'styled-components';
import { Container, Button } from '../styles/CommonStyles';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background-color: var(--primary-color);
  color: white;
  padding: 6rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const Section = styled.section`
  padding: 5rem 0;
  
  &:nth-child(even) {
    background-color: var(--light-gray);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--dark-gray);
  max-width: 700px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.6;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MissionCard = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  text-align: center;
  transition: transform 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const MissionIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const MissionTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const MissionText = styled.p`
  font-size: 1rem;
  color: var(--dark-gray);
  line-height: 1.6;
`;

const TeamSection = styled.section`
  padding: 5rem 0;
  background-color: var(--light-gray);
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const TeamMember = styled.div`
  text-align: center;
`;

const MemberImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--medium-gray);
  margin: 0 auto 1.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberName = styled.h3`
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray);
  margin-bottom: 1rem;
`;

const CtaSection = styled.section`
  background: var(--gradient-primary);
  color: white;
  padding: 5rem 0;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.9;
`;

const AboutPage = () => {
  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroTitle>Our Story</HeroTitle>
          <HeroSubtitle>
            Empowering entrepreneurs with the knowledge and skills to turn innovative ideas into successful businesses
          </HeroSubtitle>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Our Mission</SectionTitle>
          <SectionSubtitle>
            We believe that entrepreneurship is a powerful force for positive change in the world. Our platform is built to support the next generation of innovators.
          </SectionSubtitle>

          <GridContainer>
            <MissionCard>
              <MissionIcon>🚀</MissionIcon>
              <MissionTitle>Empower</MissionTitle>
              <MissionText>
                We empower individuals with the knowledge, skills, and resources needed to build successful ventures from the ground up.
              </MissionText>
            </MissionCard>

            <MissionCard>
              <MissionIcon>🌍</MissionIcon>
              <MissionTitle>Connect</MissionTitle>
              <MissionText>
                We connect aspiring entrepreneurs with industry experts, mentors, and a community of like-minded innovators.
              </MissionText>
            </MissionCard>

            <MissionCard>
              <MissionIcon>💡</MissionIcon>
              <MissionTitle>Inspire</MissionTitle>
              <MissionText>
                We inspire creative thinking and problem-solving to address real-world challenges through entrepreneurial approaches.
              </MissionText>
            </MissionCard>
          </GridContainer>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Our Story</SectionTitle>
          <SectionSubtitle>
            EntrepreneurHub was founded in 2023 with a vision to democratize access to entrepreneurship education.
          </SectionSubtitle>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
              EntrepreneurHub began with a simple observation: while the world has no shortage of brilliant ideas, many aspiring entrepreneurs lack the structured guidance needed to transform those ideas into successful businesses.
            </p>

            <p style={{ marginBottom: '1.5rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
              Our founders, having experienced the challenges of building startups firsthand, recognized that traditional education often falls short in teaching the practical skills needed for entrepreneurial success. They envisioned a platform where industry experts could share real-world knowledge, and where learners could acquire skills directly applicable to their entrepreneurial journey.
            </p>

            <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
              Today, EntrepreneurHub has grown into a comprehensive learning platform serving thousands of aspiring and established entrepreneurs worldwide. We continuously expand our course offerings and community features to meet the evolving needs of modern business builders.
            </p>
          </div>
        </Container>
      </Section>

      <TeamSection>
        <Container>
          <SectionTitle>Our Team</SectionTitle>
          <SectionSubtitle>
            Meet the passionate individuals behind EntrepreneurHub who are committed to your entrepreneurial success.
          </SectionSubtitle>

          <TeamGrid>
            <TeamMember>
              <MemberImage>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Sarah Johnson" />
              </MemberImage>
              <MemberName>Sarah Johnson</MemberName>
              <MemberRole>Founder & CEO</MemberRole>
            </TeamMember>

            <TeamMember>
              <MemberImage>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a" alt="Michael Chen" />
              </MemberImage>
              <MemberName>Michael Chen</MemberName>
              <MemberRole>Co-Founder & CTO</MemberRole>
            </TeamMember>

            <TeamMember>
              <MemberImage>
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" alt="Amanda Williams" />
              </MemberImage>
              <MemberName>Amanda Williams</MemberName>
              <MemberRole>Chief Content Officer</MemberRole>
            </TeamMember>

            <TeamMember>
              <MemberImage>
                <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857" alt="Robert Davis" />
              </MemberImage>
              <MemberName>Robert Davis</MemberName>
              <MemberRole>Head of Education</MemberRole>
            </TeamMember>
          </TeamGrid>
        </Container>
      </TeamSection>

      <CtaSection>
        <Container>
          <CtaTitle>Ready to Start Your Entrepreneurial Journey?</CtaTitle>
          <CtaText>
            Join thousands of entrepreneurs who are building the future with skills learned on EntrepreneurHub.
          </CtaText>
          <Button as={Link} to="/courses" primary large>
            Explore Our Courses
          </Button>
        </Container>
      </CtaSection>
    </PageContainer>
  );
};

export default AboutPage;
