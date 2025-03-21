import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    max-width: 700px;
    opacity: 0.9;
  }
`;

const MentorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const MentorCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MentorImage = styled.div`
  height: 200px;
  background-color: var(--light-gray);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MentorInfo = styled.div`
  padding: 1.5rem;
`;

const MentorName = styled.h3`
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const MentorTitle = styled.div`
  color: var(--secondary-color);
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MentorBio = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  height: 85px;
  overflow: hidden;
`;

const MentorTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const MentorTag = styled.span`
  background-color: var(--light-gray);
  color: var(--dark-gray);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--light-gray)'};
  color: ${props => props.active ? 'white' : 'var(--dark-gray)'};
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--medium-gray)'};
  }
`;

const MentorshipPage = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // In a real app, this would be an API call
    // For now we'll use mock data
    setTimeout(() => {
      const mockMentors = [
        {
          id: 1,
          name: 'Sarah Johnson',
          title: 'CEO, TechnoVision',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
          bio: 'Serial entrepreneur with 3 successful exits. Expert in SaaS and marketplace business models.',
          categories: ['tech', 'saas', 'funding'],
          specialties: ['Product Strategy', 'Fundraising', 'Growth']
        },
        {
          id: 2,
          name: 'Michael Chen',
          title: 'Marketing Director, GrowthLabs',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
          bio: 'Digital marketing expert specializing in go-to-market strategies for early-stage startups.',
          categories: ['marketing', 'ecommerce'],
          specialties: ['Digital Marketing', 'SEO', 'Content Strategy']
        },
        {
          id: 3,
          name: 'David Rodriguez',
          title: 'Founder, FinTech Solutions',
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
          bio: 'Fintech entrepreneur with expertise in financial modeling and investment strategies.',
          categories: ['finance', 'funding'],
          specialties: ['Financial Planning', 'Investment Strategy', 'Bootstrapping']
        },
        {
          id: 4,
          name: 'Emma Wilson',
          title: 'UX Director, DesignHub',
          image: 'https://images.unsplash.com/photo-1548142813-c348350df52b',
          bio: 'Product and UX expert with experience at major tech companies. Specializes in user-centric design.',
          categories: ['design', 'tech'],
          specialties: ['UX/UI Design', 'Product Development', 'Design Thinking']
        }
      ];

      setMentors(mockMentors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMentors = activeFilter === 'all'
    ? mentors
    : mentors.filter(mentor => mentor.categories.includes(activeFilter));

  return (
    <PageContainer>
      <PageHeader>
        <Container>
          <h1>Find Your Mentor</h1>
          <p>Connect with experienced entrepreneurs who can guide you on your business journey. Our mentors provide personalized advice tailored to your specific challenges.</p>
        </Container>
      </PageHeader>

      <Container>
        <FilterSection>
          <h2>Browse by Expertise</h2>
          <FiltersContainer>
            <FilterButton
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton
              active={activeFilter === 'tech'}
              onClick={() => setActiveFilter('tech')}
            >
              Technology
            </FilterButton>
            <FilterButton
              active={activeFilter === 'marketing'}
              onClick={() => setActiveFilter('marketing')}
            >
              Marketing
            </FilterButton>
            <FilterButton
              active={activeFilter === 'finance'}
              onClick={() => setActiveFilter('finance')}
            >
              Finance
            </FilterButton>
            <FilterButton
              active={activeFilter === 'design'}
              onClick={() => setActiveFilter('design')}
            >
              Design
            </FilterButton>
            <FilterButton
              active={activeFilter === 'funding'}
              onClick={() => setActiveFilter('funding')}
            >
              Fundraising
            </FilterButton>
          </FiltersContainer>
        </FilterSection>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading mentors...</div>
        ) : (
          <MentorsGrid>
            {filteredMentors.map(mentor => (
              <MentorCard key={mentor.id}>
                <MentorImage>
                  <img src={mentor.image} alt={mentor.name} />
                </MentorImage>
                <MentorInfo>
                  <MentorName>{mentor.name}</MentorName>
                  <MentorTitle>{mentor.title}</MentorTitle>
                  <MentorBio>{mentor.bio}</MentorBio>

                  <MentorTags>
                    {mentor.specialties.map((specialty, index) => (
                      <MentorTag key={index}>{specialty}</MentorTag>
                    ))}
                  </MentorTags>

                  <Button primary fullWidth>Request Mentoring</Button>
                </MentorInfo>
              </MentorCard>
            ))}
          </MentorsGrid>
        )}

        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h2>How Mentorship Works</h2>
          <p style={{ maxWidth: '700px', margin: '1rem auto 2rem', color: 'var(--dark-gray)' }}>
            Our mentorship program connects you with experienced entrepreneurs for personalized guidance.
            Sessions are conducted via video calls and scheduled at times convenient for both parties.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Button as="a" href="/mentorship-program" primary>Learn More</Button>
            <Button as="a" href="/become-mentor" secondary>Become a Mentor</Button>
          </div>
        </div>
      </Container>
    </PageContainer>
  );
};

export default MentorshipPage;
