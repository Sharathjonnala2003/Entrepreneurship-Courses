import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/CommonStyles';

// Enhanced modal with cleaner look
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Improved modal container with subtle animations
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

// Improved header with gradient background option
const ModalHeader = styled.div`
  padding: 1.5rem;
  background: ${props => props.isEdit ? 'linear-gradient(to right, var(--primary-color), var(--primary-color-dark))' : 'var(--primary-color)'};
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

// Improved form group with better spacing and labels
const FormGroup = styled.div`
  margin-bottom: 1.8rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--dark-gray);
    font-size: 0.95rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--medium-gray);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(26, 26, 64, 0.1);
    }
    
    &::placeholder {
      color: #b0b0b0;
    }
  }
  
  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 2.5rem;
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

// Improved modal footer with subtle separator
const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
`;

// Improved delete button with more visual warning
const DeleteButton = styled(Button)`
  background-color: white;
  color: #E53E3E;
  border: 1px solid #E53E3E;
  
  &:hover {
    background-color: #E53E3E;
    color: white;
  }
`;

// Added helper text component
const HelperText = styled.div`
  font-size: 0.8rem;
  color: var(--medium-gray);
  margin-top: 0.5rem;
`;

const ScheduleEventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  timeSlot,
  enrolledCourses
}) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    courseId: '',
    description: '',
    courseName: ''
  });

  useEffect(() => {
    if (event) {
      // Edit mode
      setFormData({
        title: event.title,
        start: formatDateTimeForInput(event.start),
        end: formatDateTimeForInput(event.end),
        courseId: event.courseId || '',
        description: event.description || '',
        courseName: event.courseName || ''
      });
    } else if (timeSlot) {
      // New event from selected time slot
      setFormData({
        title: '',
        start: formatDateTimeForInput(timeSlot.start),
        end: formatDateTimeForInput(timeSlot.end),
        courseId: '',
        description: '',
        courseName: ''
      });
    } else {
      // Default empty form
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setFormData({
        title: '',
        start: formatDateTimeForInput(now),
        end: formatDateTimeForInput(oneHourLater),
        courseId: '',
        description: '',
        courseName: ''
      });
    }
  }, [event, timeSlot, isOpen]);

  // Format date for datetime-local input
  const formatDateTimeForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'courseId') {
      const selectedCourse = enrolledCourses.find(course => course.course_id.toString() === value);
      const courseName = selectedCourse ? selectedCourse.title : '';

      setFormData(prev => ({
        ...prev,
        [name]: value,
        courseName,
        title: value ? `Study: ${courseName}` : prev.title
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.start || !formData.end) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert string dates to Date objects
    const eventData = {
      ...formData,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
      courseId: formData.courseId || null
    };

    onSave(eventData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader isEdit={!!event}>
          <h2>{event ? 'Edit Study Session' : 'Schedule Study Time'}</h2>
          <button onClick={onClose}>&times;</button>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <label htmlFor="courseId">Course (Optional)</label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">-- Select a course --</option>
                {enrolledCourses.map(course => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <HelperText>Linking to a course will help you track your study progress.</HelperText>
            </FormGroup>

            <FormGroup>
              <label htmlFor="title">Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Study Session, Complete Assignment"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label htmlFor="start">Start Time*</label>
                <input
                  type="datetime-local"
                  id="start"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="end">End Time*</label>
                <input
                  type="datetime-local"
                  id="end"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label htmlFor="description">Notes</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any details or notes about this study session"
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            {event ? (
              <>
                <DeleteButton
                  type="button"
                  onClick={() => onDelete(event.id)}
                >
                  Delete
                </DeleteButton>
                <div>
                  <Button
                    type="button"
                    onClick={onClose}
                    secondary
                    style={{ marginRight: '0.75rem' }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" primary>Save Changes</Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={onClose}
                  secondary
                >
                  Cancel
                </Button>
                <Button type="submit" primary>Schedule</Button>
              </>
            )}
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ScheduleEventModal;
