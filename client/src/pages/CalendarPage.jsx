import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';
import ScheduleEventModal from '../components/ScheduleEventModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useToast } from '../context/ToastContext'; // Create this context if it doesn't exist

const localizer = momentLocalizer(moment);

// Enhanced container with more visual appeal
const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
  background-color: var(--background-color);
`;

// Improved header with better spacing and alignment
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    color: var(--primary-color);
    margin: 0;
    font-size: 2rem;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: var(--primary-color);
    }
  }
`;

// More attractive action buttons bar
const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Clean, modern control buttons
const ViewControlButton = styled.button`
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--medium-gray)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'var(--light-gray)'};
  }
`;

// Button group with connected appearance
const ButtonGroup = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  
  button {
    background: white;
    color: var(--text-color);
    border: 1px solid var(--medium-gray);
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0;
    
    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }
    
    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
    
    &:hover {
      background: var(--light-gray);
    }
    
    &:not(:last-child) {
      border-right: none;
    }
  }
`;

// More modern and clean calendar container
const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: 700px;
  
  .rbc-calendar {
    height: 100%;
    font-family: 'Inter', sans-serif;
  }
  
  .rbc-toolbar {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--light-gray);
  }
  
  .rbc-toolbar button {
    color: var(--text-color);
    border: 1px solid var(--medium-gray);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    
    &:active, &.rbc-active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      box-shadow: none;
    }
    
    &:hover {
      background-color: var(--light-gray);
    }
  }
  
  .rbc-month-view {
    border-radius: 8px;
    border: 1px solid var(--light-gray);
  }
  
  .rbc-header {
    padding: 12px 3px;
    font-weight: 600;
    color: var(--dark-gray);
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
  }
  
  .rbc-event {
    background-color: var(--primary-color);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 4px 8px;
    
    &:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
  }
  
  .rbc-day-slot .rbc-event {
    border: none;
  }
  
  .rbc-today {
    background-color: rgba(26, 26, 64, 0.05);
  }
  
  .rbc-off-range-bg {
    background-color: #f9f9f9;
  }
  
  .rbc-date-cell {
    padding: 4px 8px;
    text-align: center;
    color: var(--text-color);
    font-weight: 500;
  }
  
  .rbc-day-bg + .rbc-day-bg {
    border-left: 1px solid #f0f0f0;
  }
  
  .rbc-month-row + .rbc-month-row {
    border-top: 1px solid #f0f0f0;
  }
  
  /* Enhanced time view styles with grid */
  .rbc-time-view {
    border-radius: 8px;
    border: 1px solid var(--light-gray);
  }
  
  /* Grid styling for day view */
  .rbc-time-content {
    border-top: 1px solid #f0f0f0;
    background-image: repeating-linear-gradient(
      #f9f9f9 0px,
      #f9f9f9 1px,
      transparent 1px,
      transparent 35px
    );
    background-size: 100% 35px;
  }
  
  .rbc-timeslot-group {
    min-height: 70px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background-color: #f0f0f0;
      opacity: 0.5;
    }
  }
  
  /* Improved time labels */
  .rbc-time-gutter .rbc-timeslot-group {
    color: var(--dark-gray);
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .rbc-time-header-gutter {
    background-color: #f9f9f9;
  }
  
  .rbc-time-header-content {
    border-left: 1px solid #f0f0f0;
    
    .rbc-header {
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  /* Styling for the current time indicator */
  .rbc-current-time-indicator {
    height: 2px;
    background-color: #e74c3c;
    opacity: 0.7;
    
    &::before {
      content: '';
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #e74c3c;
      left: -4px;
      top: -3px;
    }
  }
  
  /* Add styles for custom event rendering */
  .custom-event {
    background-color: ${props => props.courseEvent ? 'var(--primary-color)' : 'var(--secondary-color)'};
    color: white;
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-left: 3px solid ${props => props.courseEvent ? 'var(--primary-color-dark)' : 'var(--secondary-color-dark)'};
  }
  
  .custom-event-title {
    font-weight: 600;
    padding: 3px 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .custom-event-time {
    font-size: 0.75rem;
    opacity: 0.9;
    padding: 0 6px 3px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: var(--dark-gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    animation: spin 1.5s linear infinite;
    width: 40px;
    height: 40px;
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  
  p {
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
    font-size: 1.1rem;
  }
  
  svg {
    width: 60px;
    height: 60px;
    margin-bottom: 1.5rem;
    color: var(--medium-gray);
  }
`;

// Enhanced message containers
const StyledMessage = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  svg {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
  }
`;

const ErrorMessage = styled(StyledMessage)`
  background-color: #FFF5F5;
  color: #E53E3E;
  border-left: 4px solid #E53E3E;
`;

const SuccessMessage = styled(StyledMessage)`
  background-color: #F0FFF4;
  color: #38A169;
  border-left: 4px solid #38A169;
`;

// Today button with more visual appeal
const TodayButton = styled.button`
  background: transparent;
  border: 1px solid var(--medium-gray);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--light-gray);
  }
`;

// Add event button with improved styling
const AddEventButton = styled(Button)`
  border-radius: 30px;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(26, 26, 64, 0.15);
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26, 26, 64, 0.2);
  }
`;

const CalendarPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [localEvents, setLocalEvents] = useState([]);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const { showToast } = useToast?.() || { showToast: (msg) => alert(msg) };

  // Function to fetch calendar data
  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      // Clear any previous messages
      setMessage({ type: '', text: '' });

      console.log('Fetching calendar data...');
      const eventsResponse = await axios.get('/calendar-events');

      // Format events for the calendar
      const formattedEvents = eventsResponse.data.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        courseId: event.course_id,
        description: event.description,
        courseName: event.course_title
      }));

      console.log(`Loaded ${formattedEvents.length} calendar events`);
      setEvents(formattedEvents);

      // Fetch enrolled courses for the dropdown
      const enrollmentsResponse = await axios.get('/enrollments');
      console.log(`Loaded ${enrollmentsResponse.data.length} enrolled courses`);
      setEnrolledCourses(enrollmentsResponse.data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      // Log more detailed error info
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      setMessage({
        type: 'error',
        text: 'Failed to load your calendar data. Please try refreshing the page.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCalendarData();
    }
  }, [user, fetchCalendarData]);

  // Clear any messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      // Make a copy of the data for debugging
      console.log('Submitting event data:', JSON.stringify(eventData));

      if (selectedEvent) {
        // Update existing event
        console.log(`Updating event ${selectedEvent.id}`);
        const response = await axios.put(`/calendar-events/${selectedEvent.id}`, eventData);

        setEvents(prevEvents => prevEvents.map(event =>
          event.id === selectedEvent.id
            ? {
              ...event,
              title: eventData.title,
              start: new Date(eventData.start),
              end: new Date(eventData.end),
              courseId: eventData.courseId,
              description: eventData.description,
              courseName: eventData.courseName
            }
            : event
        ));

        setMessage({
          type: 'success',
          text: 'Your study session has been updated successfully!'
        });
      } else {
        // Create new event - include explicit null for courseId if not present
        console.log('Creating new calendar event');

        // Ensure we're sending cleaned data
        const cleanedData = {
          ...eventData,
          courseId: eventData.courseId || null
        };

        const response = await axios.post('/calendar-events', cleanedData);

        setEvents(prevEvents => [...prevEvents, {
          id: response.data.id,
          title: eventData.title,
          start: new Date(eventData.start),
          end: new Date(eventData.end),
          courseId: eventData.courseId,
          description: eventData.description,
          courseName: eventData.courseName
        }]);

        setMessage({
          type: 'success',
          text: 'Your study session has been scheduled successfully!'
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
      let errorMessage = 'Failed to save your study session. Please try again.';

      if (error.response) {
        console.error('Server error:', error.response.data);
        errorMessage = error.response.data.error || errorMessage;
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      console.log(`Deleting event ${eventId}`);
      await axios.delete(`/calendar-events/${eventId}`);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      handleCloseModal();

      setMessage({
        type: 'success',
        text: 'Study session has been deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting event:', error);

      setMessage({
        type: 'error',
        text: 'Failed to delete the study session. Please try again.'
      });
    }
  };

  // Function to navigate to today
  const handleNavigateToday = () => {
    setDate(new Date());
  };

  // Custom event component for better visual appearance
  const EventComponent = ({ event }) => {
    const isCourseEvent = !!event.courseId;

    return (
      <div className="custom-event" style={{ backgroundColor: isCourseEvent ? 'var(--primary-color)' : 'var(--secondary-color)' }}>
        <div className="custom-event-title">{event.title}</div>
        <div className="custom-event-time">
          {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <PageContainer>
        <Container>
          <EmptyMessage>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Please sign in to access your learning calendar.</p>
            <Button as="a" href="/login" primary>Sign In</Button>
          </EmptyMessage>
        </Container>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingMessage>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p>Loading your calendar...</p>
          </LoadingMessage>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>My Learning Calendar</h1>
          <AddEventButton
            primary
            onClick={() => {
              setSelectedSlot({
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 1))
              });
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Study Time
          </AddEventButton>
        </PageHeader>

        {message.text && (
          message.type === 'error' ? (
            <ErrorMessage>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{message.text}</span>
            </ErrorMessage>
          ) : (
            <SuccessMessage>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{message.text}</span>
            </SuccessMessage>
          )
        )}

        <ActionBar>
          <ButtonGroup>
            <ViewControlButton
              active={view === 'month'}
              onClick={() => setView('month')}
            >
              Month
            </ViewControlButton>
            <ViewControlButton
              active={view === 'week'}
              onClick={() => setView('week')}
            >
              Week
            </ViewControlButton>
            <ViewControlButton
              active={view === 'day'}
              onClick={() => setView('day')}
            >
              Day
            </ViewControlButton>
            <ViewControlButton
              active={view === 'agenda'}
              onClick={() => setView('agenda')}
            >
              Agenda
            </ViewControlButton>
          </ButtonGroup>

          <TodayButton onClick={handleNavigateToday}>
            Today
          </TodayButton>
        </ActionBar>

        <CalendarContainer>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            view={view}
            onView={setView}
            date={date}
            onNavigate={date => setDate(date)}
            defaultView="week"
            style={{ height: '100%' }}
            eventPropGetter={(event) => {
              const backgroundColor = event.courseId ? 'var(--primary-color)' : 'var(--secondary-color)';
              return { style: { backgroundColor } };
            }}
            tooltipAccessor={event => `${event.title}${event.description ? `\n${event.description}` : ''}`}
            components={{
              event: EventComponent
            }}
            popup
            showMultiDayTimes
            step={30}
            timeslots={2}
            getNow={() => new Date()}
            dayLayoutAlgorithm="no-overlap"
            currentTimeIndicator={true}
          />
        </CalendarContainer>

        {enrolledCourses.length === 0 && (
          <EmptyMessage>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>You haven't enrolled in any courses yet. Enroll in courses to schedule your learning time.</p>
            <Button as="a" href="/courses" primary>Browse Courses</Button>
          </EmptyMessage>
        )}

        <ScheduleEventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          event={selectedEvent}
          timeSlot={selectedSlot}
          enrolledCourses={enrolledCourses}
        />
      </Container>
    </PageContainer>
  );
};

// Add this styled component
const StorageNotice = styled.div`
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  
  &:before {
    content: "⚠️";
    margin-right: 0.5rem;
  }
`;

export default CalendarPage;
