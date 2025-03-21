import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SearchContainer = styled.div`
  width: 100%;
  position: relative;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(26, 26, 64, 0.1);
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #141432;
  }
`;

const SearchBar = ({ placeholder = "Search for courses...", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Default behavior - navigate to courses page with search param
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchBar;
