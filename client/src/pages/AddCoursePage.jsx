import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--medium-gray);
    border-radius: 5px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const Message = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border-radius: 5px;
  
  &.success {
    background-color: #d4edda;
    color: #155724;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

const AddCoursePage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Business Strategy',
    duration: '',
    price: '',
    instructor: '',
    image: '',
    rating: 0,
    studentsEnrolled: 0
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['Business Strategy', 'Marketing', 'Finance', 'Leadership', 'Innovation'];

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin()) {
      console.log('Not admin, redirecting');
      navigate('/courses');
    }
  }, [user, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Log the submission attempt
    console.log('Attempting to submit course:', formData);
    console.log('Current user:', user);

    // Ensure price is a number
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum)) {
      setMessage({ type: 'error', text: 'Price must be a valid number' });
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting course data to API');

      // Get token for authorization
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Available' : 'Not available');

      // IMPORTANT FIX: Use the correct API endpoint with '/api' prefix
      const response = await axios.post('/courses', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration: formData.duration,
        price: priceNum,
        instructor: formData.instructor,
        image: formData.image || undefined
      });

      console.log('Course added successfully:', response.data);

      setMessage({
        type: 'success',
        text: 'Course added successfully!'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Business Strategy',
        duration: '',
        price: '',
        instructor: '',
        image: '',
        rating: 0,
        studentsEnrolled: 0
      });

      // Redirect to courses page after 2 seconds
      setTimeout(() => {
        navigate('/courses');
      }, 2000);

    } catch (error) {
      console.error('Error adding course:', error);
      let errorMessage = 'Failed to add course. Please try again.';

      if (error.response) {
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data.error || errorMessage;
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>Add New Course</h1>
          <p>Create a new entrepreneurship course to share your knowledge</p>
        </PageHeader>

        <FormContainer>
          {message.text && (
            <div className={message.type === 'success' ? 'success-message' : 'error-message'}
              style={{
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                padding: '1rem',
                borderRadius: '5px',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="title">Course Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Business Strategy Fundamentals"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="description">Course Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide a detailed description of the course"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="duration">Duration*</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 8 weeks"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <label htmlFor="price">Price ($)*</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g. 299"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="instructor">Instructor Name*</label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sarah Johnson"
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <label htmlFor="image">Course Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <small>Leave empty for a default image</small>
            </FormGroup>

            <SubmitButton
              type="submit"
              primary
              fullWidth
              disabled={loading}
            >
              {loading ? 'Adding Course...' : 'Add Course'}
            </SubmitButton>
          </form>
        </FormContainer>
      </Container>
    </PageContainer>
  );
};

export default AddCoursePage;
