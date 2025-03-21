import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const FormContainer = styled.div`
  max-width: 450px;
  width: 100%;
  background-color: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  input {
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
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--dark-gray);
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user, authError } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/courses');
    }
  }, [user, navigate]);

  // Show auth error from context if present
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Log auth attempt for debugging
      console.log('Login attempt:', {
        email: formData.email,
        passwordLength: formData.password ? formData.password.length : 0
      });

      // Try direct fetch first as a diagnostic step
      try {
        const directResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        });
        
        console.log('Direct fetch status:', directResponse.status);
        const directData = await directResponse.json();
        console.log('Direct fetch response:', directData);
      } catch (fetchError) {
        console.error('Direct fetch error:', fetchError);
      }

      // Now try using AuthContext
      const { success, error: loginError } = await login(formData);

      if (success) {
        console.log('Login successful, redirecting to courses');
        navigate('/courses');
      } else {
        console.error('Login failed:', loginError);
        setError(loginError);
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Container>
        <FormContainer>
          <FormHeader>
            <h1>Welcome Back</h1>
            <p>Sign in to access your account</p>
          </FormHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your email address"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              primary
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </SubmitButton>
          </form>

          <FormFooter>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </FormFooter>

          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--dark-gray)' }}>
            <p>Demo credentials: admin@example.com / admin123</p>
          </div>
        </FormContainer>
      </Container>
    </PageContainer>
  );
};

export default LoginPage;
