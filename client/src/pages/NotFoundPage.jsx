import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Button } from '../styles/CommonStyles';

const NotFoundContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
`;

const NotFoundContent = styled.div`
  max-width: 600px;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <Container>
        <NotFoundContent>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>Page Not Found</ErrorTitle>
          <ErrorDescription>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </ErrorDescription>
          <ButtonContainer>
            <Button as={Link} to="/" primary>
              Return to Home
            </Button>
            <Button as={Link} to="/courses" secondary>
              Browse Courses
            </Button>
          </ButtonContainer>
        </NotFoundContent>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
