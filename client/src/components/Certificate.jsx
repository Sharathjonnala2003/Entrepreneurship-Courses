import React from 'react';
import styled from 'styled-components';
import { Button } from '../styles/CommonStyles';

const CertificateContainer = styled.div`
  margin-bottom: 2rem;
`;

const CertificateWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
`;

const CertificateContent = styled.div`
  border: 15px solid var(--primary-color);
  padding: 3rem;
  text-align: center;
  background-color: white;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid var(--secondary-color);
    margin: 10px;
    pointer-events: none;
  }
`;

const CertificateHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  p {
    font-size: 1.5rem;
    color: var(--dark-gray);
  }
`;

const CertificateBody = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  h3 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
  }
  
  p {
    font-size: 1.2rem;
  }
`;

const CertificateFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
`;

const SignatureArea = styled.div`
  text-align: center;
  
  .line {
    width: 200px;
    height: 1px;
    background-color: var(--dark-gray);
    margin: 0 auto 0.5rem;
  }
  
  p {
    font-weight: bold;
  }
`;

const CertificateActions = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Certificate = ({ userName, courseName, completionDate, courseInstructor }) => {
  const certificateRef = React.useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <CertificateContainer>
      <CertificateWrapper ref={certificateRef}>
        <CertificateContent>
          <CertificateHeader>
            <h1>Certificate of Completion</h1>
            <p>This is to certify that</p>
          </CertificateHeader>

          <CertificateBody>
            <h2>{userName}</h2>
            <h3>has successfully completed</h3>
            <p>{courseName}</p>
            <p>on {formatDate(completionDate)}</p>
          </CertificateBody>

          <CertificateFooter>
            <SignatureArea>
              <div className="line"></div>
              <p>{courseInstructor}</p>
              <p>Instructor</p>
            </SignatureArea>

            <SignatureArea>
              <div className="line"></div>
              <p>EntrepreneurHub</p>
              <p>Platform Director</p>
            </SignatureArea>
          </CertificateFooter>
        </CertificateContent>
      </CertificateWrapper>

      <CertificateActions>
        <Button primary>Print using Browser (Ctrl+P)</Button>
      </CertificateActions>
    </CertificateContainer>
  );
};

export default Certificate;
