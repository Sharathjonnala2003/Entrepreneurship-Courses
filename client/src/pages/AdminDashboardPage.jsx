import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Container, Button } from '../styles/CommonStyles';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  background-color: var(--light-gray);
  padding: 2rem 0;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--dark-gray);
  font-size: 1rem;
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  margin-bottom: 2rem;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }
`;

const Chart = styled.div`
  height: 300px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding-top: 20px;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Bar = styled.div`
  width: 100%;
  background-color: var(--primary-color);
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 1s ease;
`;

const BarLabel = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--dark-gray);
  text-align: center;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 2rem;
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

const TableContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--light-gray);
  }
  
  th {
    background-color: var(--light-gray);
    color: var(--primary-color);
    font-weight: 600;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => props.active && `
    background-color: rgba(40, 167, 69, 0.1);
    color: #28a745;
  `}
  
  ${props => props.inactive && `
    background-color: rgba(108, 117, 125, 0.1);
    color: #6c757d;
  `}
`;

const ActionButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.8rem;
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--medium-gray)'};
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--light-gray)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    revenue: 0
  });
  const [enrollmentsData, setEnrollmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Enhanced error check for admin access
  useEffect(() => {
    if (!user) {
      console.log('No user logged in, redirecting to login');
      navigate('/login');
      return;
    }

    // Check admin status with explicit logging
    console.log('User role:', user.role);
    console.log('Is admin?', user.role === 'admin');

    if (user && user.role !== 'admin') {
      console.log('User is not an admin, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;

      setLoading(true);
      console.log('Fetching admin dashboard data...');

      try {
        // In a real app, these would be actual API calls to your backend
        // For now we'll use mock data as in your original implementation

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock courses data
        const coursesData = [
          { id: 1, title: 'Business Strategy Fundamentals', category: 'Business Strategy', price: 299, studentsEnrolled: 1254, status: 'active' },
          { id: 2, title: 'Digital Marketing Mastery', category: 'Marketing', price: 249, studentsEnrolled: 987, status: 'active' },
          { id: 3, title: 'Startup Funding & Finance', category: 'Finance', price: 349, studentsEnrolled: 856, status: 'active' },
          { id: 4, title: 'Leadership for Entrepreneurs', category: 'Leadership', price: 199, studentsEnrolled: 1123, status: 'active' },
          { id: 5, title: 'Product Development & Innovation', category: 'Business Strategy', price: 279, studentsEnrolled: 654, status: 'active' },
          { id: 6, title: 'Sales Techniques for Startups', category: 'Marketing', price: 179, studentsEnrolled: 432, status: 'active' },
          { id: 7, title: 'Entrepreneurial Mindset', category: 'Leadership', price: 149, studentsEnrolled: 312, status: 'inactive' }
        ];

        // Mock users data
        const usersData = [
          { id: 1, name: 'John Smith', email: 'john@example.com', role: 'user', enrolledCourses: 3, lastActive: '2023-11-28T15:30:00Z' },
          { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'admin', enrolledCourses: 0, lastActive: '2023-11-29T09:45:00Z' },
          { id: 3, name: 'Michael Lee', email: 'michael@example.com', role: 'user', enrolledCourses: 2, lastActive: '2023-11-27T11:20:00Z' },
          { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'user', enrolledCourses: 5, lastActive: '2023-11-29T14:10:00Z' },
          { id: 5, name: 'James Brown', email: 'james@example.com', role: 'user', enrolledCourses: 1, lastActive: '2023-11-20T08:30:00Z' },
          { id: 6, name: 'Olivia Taylor', email: 'olivia@example.com', role: 'user', enrolledCourses: 0, lastActive: '2023-11-15T16:45:00Z' }
        ];

        // Calculate stats
        const totalUsers = usersData.length;
        const totalCourses = coursesData.length;
        const totalEnrollments = coursesData.reduce((sum, course) => sum + course.studentsEnrolled, 0);
        const revenue = coursesData.reduce((sum, course) => sum + (course.price * course.studentsEnrolled), 0);

        // Mock enrollments data for chart (last 7 days)
        const enrollments = [45, 52, 38, 65, 74, 50, 68];

        console.log('Admin dashboard data fetched successfully');
        setCourses(coursesData);
        setUsers(usersData);
        setStats({
          totalUsers,
          totalCourses,
          totalEnrollments,
          revenue
        });
        setEnrollmentsData(enrollments);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (activeTab === 'courses') {
      return courses.slice(startIndex, endIndex);
    } else {
      return users.slice(startIndex, endIndex);
    }
  };

  const totalPages = Math.ceil(
    (activeTab === 'courses' ? courses.length : users.length) / itemsPerPage
  );

  if (!user) {
    return <LoadingScreen />;
  }

  if (user && user.role !== 'admin') {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
          <Button as={Link} to="/" primary style={{ marginTop: '1rem' }}>
            Return to Home
          </Button>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <Container>
          <h1>Admin Dashboard</h1>
          <p>Manage courses, users, and view platform analytics</p>
        </Container>
      </PageHeader>

      <Container>
        <DashboardGrid>
          <StatsCard>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatsCard>

          <StatsCard>
            <StatValue>{stats.totalCourses}</StatValue>
            <StatLabel>Total Courses</StatLabel>
          </StatsCard>

          <StatsCard>
            <StatValue>{stats.totalEnrollments.toLocaleString()}</StatValue>
            <StatLabel>Total Enrollments</StatLabel>
          </StatsCard>

          <StatsCard>
            <StatValue>{formatCurrency(stats.revenue)}</StatValue>
            <StatLabel>Total Revenue</StatLabel>
          </StatsCard>
        </DashboardGrid>

        <ChartContainer>
          <h2>New Enrollments (Last 7 Days)</h2>
          <Chart>
            {enrollmentsData.map((value, index) => {
              const percentage = (value / Math.max(...enrollmentsData)) * 100;
              return (
                <BarChart key={index}>
                  <Bar height={percentage} />
                  <BarLabel>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                  </BarLabel>
                </BarChart>
              );
            })}
          </Chart>
        </ChartContainer>

        <TabsContainer>
          <TabsList>
            <Tab
              active={activeTab === 'courses'}
              onClick={() => {
                setActiveTab('courses');
                setCurrentPage(1);
              }}
            >
              Courses
            </Tab>
            <Tab
              active={activeTab === 'users'}
              onClick={() => {
                setActiveTab('users');
                setCurrentPage(1);
              }}
            >
              Users
            </Tab>
          </TabsList>

          <TableContainer>
            {activeTab === 'courses' ? (
              <Table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Enrollments</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentItems().map(course => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{formatCurrency(course.price)}</td>
                      <td>{course.studentsEnrolled.toLocaleString()}</td>
                      <td>
                        <Status active={course.status === 'active'} inactive={course.status !== 'active'}>
                          {course.status === 'active' ? 'Active' : 'Inactive'}
                        </Status>
                      </td>
                      <td>
                        <ActionButton as={Link} to={`/edit-course/${course.id}`} secondary small>
                          Edit
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Enrolled Courses</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentItems().map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.enrolledCourses}</td>
                      <td>{formatDate(user.lastActive)}</td>
                      <td>
                        <ActionButton secondary small>
                          View
                        </ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo;
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))}

              <PageButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </PageButton>
            </Pagination>
          )}
        </TabsContainer>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button as={Link} to="/add-course" primary>
            Add New Course
          </Button>
        </div>
      </Container>
    </PageContainer>
  );
};

export default AdminDashboardPage;
