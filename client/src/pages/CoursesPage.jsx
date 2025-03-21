import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Container, ButtonLink } from '../styles/CommonStyles';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';

const CoursesPageContainer = styled.div`
  min-height: 100vh;
`;

const CoursesHeader = styled.div`
  background-color: var(--light-gray);
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--dark-gray);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const CoursesFilter = styled.div`
  margin-bottom: 2rem;
`;

const FilterCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: 1rem;
    justify-content: flex-start;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: transparent;
  border: 1px solid var(--medium-gray);
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
  
  ${props => props.active && `
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  `}
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--dark-gray);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--dark-gray);
`;

const ActionButton = styled(ButtonLink)`
  margin-left: auto;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SearchBarContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const AdvancedFiltersContainer = styled.div`
  margin-bottom: 1.5rem;
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: 5px;
`;

const AdvancedFiltersToggle = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  select, input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--medium-gray);
    border-radius: 5px;
  }
`;

const NoCoursesFound = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--light-gray);
  border-radius: 8px;
  
  h3 {
    margin-bottom: 1rem;
  }
`;

const CoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Categories for filter
  const categories = ['All', 'Business Strategy', 'Marketing', 'Finance', 'Leadership', 'Innovation'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching courses from API...');

        // Fix: Make sure we're using the correct API endpoint
        const response = await axios.get('/courses');

        console.log('Courses response:', response.data);

        // Ensure we handle the data correctly
        if (Array.isArray(response.data)) {
          setCourses(response.data);
          setFilteredCourses(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Received invalid data format from server');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        let errorMessage = 'Failed to fetch courses. Please try again later.';

        if (err.response) {
          console.error('Error status:', err.response.status);
          console.error('Error data:', err.response.data);
          errorMessage = err.response.data.error || errorMessage;
        } else if (err.request) {
          console.error('No response received');
          errorMessage = 'No response received from server';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses by category, search term, and advanced filters
  useEffect(() => {
    let results = courses;

    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter(course => course.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(course =>
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.instructor.toLowerCase().includes(search)
      );
    }

    // Apply advanced filters if enabled
    if (showAdvancedFilters) {
      // Price range filter
      results = results.filter(course =>
        course.price >= priceRange[0] && course.price <= priceRange[1]
      );

      // Rating filter
      if (ratingFilter > 0) {
        results = results.filter(course => course.rating >= ratingFilter);
      }
    }

    setFilteredCourses(results);
  }, [courses, activeCategory, searchTerm, showAdvancedFilters, priceRange, ratingFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  };

  // Check if user is admin
  const isUserAdmin = user && user.role === 'admin';

  return (
    <CoursesPageContainer>
      <CoursesHeader>
        <Container>
          <h1>Entrepreneurship Courses</h1>
          <p>Discover the skills you need to launch and grow your business</p>
        </Container>
      </CoursesHeader>

      <Container>
        {/* Search Bar */}
        <SearchBarContainer>
          <SearchBar onSearch={handleSearch} />
        </SearchBarContainer>

        <FilterHeader>
          <CoursesFilter>
            <FilterCategories>
              {categories.map(category => (
                <FilterButton
                  key={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </FilterButton>
              ))}
            </FilterCategories>
          </CoursesFilter>

          {/* Only show Add Course button to admin users */}
          {isUserAdmin && (
            <ActionButton to="/add-course" primary>Add New Course</ActionButton>
          )}
        </FilterHeader>

        {/* Advanced Filters */}
        <AdvancedFiltersToggle onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          {showAdvancedFilters ? '- Hide Advanced Filters' : '+ Show Advanced Filters'}
        </AdvancedFiltersToggle>

        {showAdvancedFilters && (
          <AdvancedFiltersContainer>
            <FilterRow>
              <div>
                <h4>Price Range:</h4>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <span>${priceRange[0]} - ${priceRange[1]}</span>
              </div>

              <div>
                <h4>Minimum Rating:</h4>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </FilterRow>
          </AdvancedFiltersContainer>
        )}

        {loading ? (
          <LoadingMessage>Loading courses...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : filteredCourses.length === 0 ? (
          <ErrorMessage>No courses found matching your criteria. Try adjusting your filters.</ErrorMessage>
        ) : (
          <CoursesGrid>
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} onDelete={handleDeleteCourse} />
            ))}
          </CoursesGrid>
        )}
      </Container>
    </CoursesPageContainer>
  );
};

export default CoursesPage;
