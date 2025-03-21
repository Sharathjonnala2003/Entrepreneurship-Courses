import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  background-color: var(--light-gray);
  padding: 3rem 0;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  p {
    color: var(--dark-gray);
    max-width: 700px;
  }
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
`;

const ProfileAvatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--light-gray);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: var(--dark-gray);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileStats = styled.div`
  margin-top: 2rem;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProfileMain = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
`;

const SectionTitle = styled.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--light-gray);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  input, textarea {
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
    min-height: 100px;
    resize: vertical;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
`;

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });

  const [enrolledCount, setEnrolledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Initialize profile with user data
      setProfile({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });

      // Fetch enrolled courses
      const fetchEnrollments = async () => {
        try {
          const response = await axios.get('/api/enrollments');
          const enrollments = response.data;

          setEnrolledCount(enrollments.length);

          // Count completed courses
          const completed = enrollments.filter(course => course.completed);
          setCompletedCount(completed.length);

          // Calculate total hours (assuming duration is in weeks and 3 hours per week)
          let hours = 0;
          enrollments.forEach(course => {
            const weeks = parseInt(course.duration);
            if (!isNaN(weeks)) {
              hours += weeks * 3;
            }
          });
          setTotalHours(hours);

        } catch (error) {
          console.error('Error fetching enrollments:', error);
        }
      };

      fetchEnrollments();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // This would be a real API call in a complete implementation
      // await axios.put('/api/profile', profile);

      // For now, simulate a successful update
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
        setIsEditing(false);
        setLoading(false);
      }, 1000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setMessage({ type: '', text: '' });
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <PageContainer>
      <PageHeader>
        <Container>
          <h1>My Profile</h1>
          <p>Manage your personal information and track your learning progress.</p>
        </Container>
      </PageHeader>

      <Container>
        <ProfileContainer>
          <ProfileSidebar>
            <ProfileAvatar>
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                getInitials(profile.name)
              )}
            </ProfileAvatar>

            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{profile.name}</h2>
            <p style={{ textAlign: 'center', color: 'var(--dark-gray)' }}>{profile.email}</p>

            <ProfileStats>
              <h3>Learning Statistics</h3>

              <StatItem>
                <span>Courses Enrolled</span>
                <span>{enrolledCount}</span>
              </StatItem>

              <StatItem>
                <span>Courses Completed</span>
                <span>{completedCount}</span>
              </StatItem>

              <StatItem>
                <span>Total Learning Hours</span>
                <span>{totalHours}</span>
              </StatItem>
            </ProfileStats>
          </ProfileSidebar>

          <ProfileMain>
            <SectionTitle>Profile Information</SectionTitle>

            {message.text && (
              message.type === 'success' ? (
                <SuccessMessage>{message.text}</SuccessMessage>
              ) : (
                <ErrorMessage>{message.text}</ErrorMessage>
              )
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={true} // Email is always disabled
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Tell us about yourself..." : "No bio provided yet."}
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="avatar">Profile Picture URL</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={profile.avatar}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter URL to your profile picture" : "No profile picture set."}
                />
              </FormGroup>

              <ActionButtons>
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      primary
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      onClick={toggleEdit}
                      secondary
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={toggleEdit}
                    primary
                  >
                    Edit Profile
                  </Button>
                )}
              </ActionButtons>
            </form>
          </ProfileMain>
        </ProfileContainer>
      </Container>
    </PageContainer>
  );
};

export default ProfilePage;
