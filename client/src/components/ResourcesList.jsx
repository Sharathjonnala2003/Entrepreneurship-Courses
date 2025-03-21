import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../styles/CommonStyles';

const ResourcesContainer = styled.div`
  margin: 2rem 0;
`;

const ResourcesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    color: var(--primary-color);
  }
`;

const ResourcesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResourceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const ResourceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ResourceIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  border-radius: 8px;
  font-size: 1.5rem;
  color: ${props => {
    switch (props.type) {
      case 'pdf': return '#ff4d4d';
      case 'doc': return '#4d79ff';
      case 'xls': return '#4dff88';
      case 'ppt': return '#ff9933';
      case 'zip': return '#bf80ff';
      default: return '#888';
    }
  }};
`;

const ResourceDetails = styled.div`
  h4 {
    margin-bottom: 0.25rem;
    color: var(--primary-color);
  }
  
  p {
    font-size: 0.9rem;
    color: var(--dark-gray);
  }
`;

const ResourceSize = styled.span`
  font-size: 0.9rem;
  color: var(--dark-gray);
  margin-right: 1rem;
`;

const LoginPrompt = styled.div`
  background-color: var(--light-gray);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  
  p {
    margin-bottom: 1rem;
  }
`;

const ResourcesList = ({ resources, courseId, isEnrolled = false }) => {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(null);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📊';
      case 'zip': return '🗄️';
      case 'mp4': case 'mov': return '🎬';
      case 'mp3': return '🔊';
      default: return '📄';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDownload = async (resourceId) => {
    if (!user || !isEnrolled) return;

    setDownloading(resourceId);

    try {
      // In a real app, this would be an actual download request
      // For demo purposes, we'll simulate a download with a timeout
      setTimeout(() => {
        setDownloading(null);
        // Simulate download by opening the URL in a new tab
        if (resources.find(r => r.id === resourceId)?.url) {
          window.open(resources.find(r => r.id === resourceId).url, '_blank');
        }
      }, 1500);
    } catch (error) {
      console.error('Error downloading resource:', error);
      setDownloading(null);
    }
  };

  if (!user) {
    return (
      <ResourcesContainer>
        <ResourcesHeader>
          <h3>Course Resources</h3>
        </ResourcesHeader>
        <LoginPrompt>
          <p>Please log in to access course resources.</p>
          <Button as="a" href="/login" primary>Sign In</Button>
        </LoginPrompt>
      </ResourcesContainer>
    );
  }

  if (!isEnrolled) {
    return (
      <ResourcesContainer>
        <ResourcesHeader>
          <h3>Course Resources</h3>
        </ResourcesHeader>
        <LoginPrompt>
          <p>You need to enroll in this course to access the resources.</p>
          <Button as="a" href={`/course/${courseId}`} primary>Enroll Now</Button>
        </LoginPrompt>
      </ResourcesContainer>
    );
  }

  return (
    <ResourcesContainer>
      <ResourcesHeader>
        <h3>Course Resources</h3>
      </ResourcesHeader>

      <ResourcesListWrapper>
        {resources.map(resource => (
          <ResourceItem key={resource.id}>
            <ResourceInfo>
              <ResourceIcon type={resource.type}>
                {getResourceIcon(resource.type)}
              </ResourceIcon>
              <ResourceDetails>
                <h4>{resource.title}</h4>
                <p>{resource.description}</p>
              </ResourceDetails>
            </ResourceInfo>

            <div>
              <ResourceSize>{formatFileSize(resource.size)}</ResourceSize>
              <Button
                small
                primary
                onClick={() => handleDownload(resource.id)}
                disabled={downloading === resource.id}
              >
                {downloading === resource.id ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          </ResourceItem>
        ))}
      </ResourcesListWrapper>
    </ResourcesContainer>
  );
};

export default ResourcesList;
