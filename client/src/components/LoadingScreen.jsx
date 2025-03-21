import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: var(--background-color);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--light-gray);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingScreen = () => {
  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  );
};

export default LoadingScreen;
