import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

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

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const EventCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const EventImage = styled.div`
  height: 180px;
  background-color: var(--light-gray);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EventStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: ${props => props.upcoming ? 'var(--primary-color)' : '#6c757d'};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const EventDate = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: white;
  color: var(--primary-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 60px;
  
  .month {
    background-color: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0;
    text-transform: uppercase;
  }
  
  .day {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0.2rem 0;
  }
`;

const EventInfo = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const EventMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: var(--dark-gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const EventDescription = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  height: 55px;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--dark-gray)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const FeaturedEvent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 300px;
  background-color: var(--light-gray);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 992px) {
    height: 300px;
  }
`;

const FeaturedInfo = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .meta {
    margin-bottom: 1.5rem;
  }
  
  .speaker {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .speaker-info {
      h4 {
        margin: 0;
        color: var(--primary-color);
      }
      
      span {
        font-size: 0.9rem;
        color: var(--dark-gray);
      }
    }
  }
  
  button {
    margin-top: auto;
  }
`;

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // In a real app, this would be an API call
    // For now we'll use mock data
    setTimeout(() => {
      const mockEvents = [
        {
          id: 1,
          title: 'Startup Funding Masterclass',
          description: 'Learn how to approach investors and secure funding for your startup in this interactive masterclass.',
          image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
          date: '2023-05-15',
          time: '2:00 PM - 4:00 PM EST',
          type: 'webinar',
          status: 'upcoming',
          speaker: {
            name: 'Jennifer Lopez',
            title: 'Angel Investor',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
          }
        },
        {
          id: 2,
          title: 'Product-Market Fit Workshop',
          description: 'A hands-on workshop to help you validate your product ideas and find the right market fit.',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
          date: '2023-05-22',
          time: '1:00 PM - 3:30 PM EST',
          type: 'workshop',
          status: 'upcoming',
          speaker: {
            name: 'Robert Chen',
            title: 'Product Strategist',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
          }
        },
        {
          id: 3,
          title: 'Networking Mixer: Tech Founders',
          description: 'Connect with other tech founders in a casual networking session focused on collaboration.',
          image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
          date: '2023-05-28',
          time: '7:00 PM - 9:00 PM EST',
          type: 'networking',
          status: 'upcoming',
          speaker: null
        },
        {
          id: 4,
          title: 'Digital Marketing Strategies',
          description: 'Discover the latest digital marketing strategies that are working for startups on limited budgets.',
          image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a70d',
          date: '2023-04-20',
          time: '2:00 PM - 3:30 PM EST',
          type: 'webinar',
          status: 'past',
          speaker: {
            name: 'Sarah Williams',
            title: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
          }
        }
      ];

      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => event.status === activeTab);
  const featuredEvent = events.find(event => event.id === 1); // Just using the first event as featured

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate()
    };
  };

  return (
    <PageContainer>
      <PageHeader>
        <Container>
          <h1>Events & Webinars</h1>
          <p>Connect with fellow entrepreneurs, learn from industry experts, and grow your network through our virtual events.</p>
        </Container>
      </PageHeader>

      <Container>
        {featuredEvent && (
          <>
            <h2>Featured Event</h2>
            <FeaturedEvent>
              <FeaturedImage>
                <img src={featuredEvent.image} alt={featuredEvent.title} />
              </FeaturedImage>
              <FeaturedInfo>
                <h2>{featuredEvent.title}</h2>
                <div className="meta">
                  <p><strong>Date:</strong> {featuredEvent.date}</p>
                  <p><strong>Time:</strong> {featuredEvent.time}</p>
                  <p><strong>Format:</strong> {featuredEvent.type.charAt(0).toUpperCase() + featuredEvent.type.slice(1)}</p>
                </div>
                <p>{featuredEvent.description}</p>

                {featuredEvent.speaker && (
                  <div className="speaker">
                    <img src={featuredEvent.speaker.image} alt={featuredEvent.speaker.name} />
                    <div className="speaker-info">
                      <h4>{featuredEvent.speaker.name}</h4>
                      <span>{featuredEvent.speaker.title}</span>
                    </div>
                  </div>
                )}

                <Button primary>Register Now</Button>
              </FeaturedInfo>
            </FeaturedEvent>
          </>
        )}

        <TabsContainer>
          <TabsList>
            <Tab
              active={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Events
            </Tab>
            <Tab
              active={activeTab === 'past'}
              onClick={() => setActiveTab('past')}
            >
              Past Events
            </Tab>
          </TabsList>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              No {activeTab} events available at the moment.
            </div>
          ) : (
            <EventsGrid>
              {filteredEvents.map(event => {
                const date = formatDate(event.date);

                return (
                  <EventCard key={event.id}>
                    <EventImage>
                      <img src={event.image} alt={event.title} />
                      <EventStatus upcoming={event.status === 'upcoming'}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                      </EventStatus>
                      <EventDate>
                        <div className="month">{date.month}</div>
                        <div className="day">{date.day}</div>
                      </EventDate>
                    </EventImage>
                    <EventInfo>
                      <EventTitle>{event.title}</EventTitle>
                      <EventMeta>
                        <div>{event.time}</div>
                        <div>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</div>
                      </EventMeta>
                      <EventDescription>{event.description}</EventDescription>

                      {event.status === 'upcoming' ? (
                        <Button primary fullWidth>Register</Button>
                      ) : (
                        <Button secondary fullWidth>View Recording</Button>
                      )}
                    </EventInfo>
                  </EventCard>
                );
              })}
            </EventsGrid>
          )}
        </TabsContainer>

        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <h2>Host Your Own Event</h2>
          <p style={{ maxWidth: '700px', margin: '1rem auto 2rem', color: 'var(--dark-gray)' }}>
            Are you an expert in your field? Share your knowledge with our community by hosting a webinar or workshop.
          </p>
          <Button as="a" href="/host-event" primary>Apply to Host</Button>
        </div>
      </Container>
    </PageContainer>
  );
};

export default EventsPage;
