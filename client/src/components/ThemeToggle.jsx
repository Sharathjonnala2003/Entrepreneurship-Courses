import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const ToggleContainer = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 20px;
  border-radius: 20px;
  background-color: ${props => props.darkMode ? 'var(--secondary-color)' : 'var(--medium-gray)'};
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 4px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
  }
`;

const ToggleCircle = styled.div`
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: ${props => props.darkMode ? 'calc(100% - 20px)' : '4px'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 10px;
    height: 10px;
    color: ${props => props.darkMode ? 'var(--secondary-color)' : 'var(--medium-gray)'};
  }
`;

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 8.7-6.8 6.4 6.4 0 0 1-10.5-7.3A9 9 0 0 0 12 3z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0-8a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V2a1 1 0 0 1 1-1zm0 20a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zM5.64 7.05a1 1 0 0 1 0 1.41l-1.4 1.41a1 1 0 1 1-1.42-1.41l1.4-1.41a1 1 0 0 1 1.42 0zm14.14 10.5a1 1 0 0 1 0-1.41l1.4-1.41a1 1 0 0 1 1.42 1.41l-1.4 1.41a1 1 0 0 1-1.42 0zM4 12a1 1 0 0 1-1-1 1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H4zm18 0a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2h-2zM7.05 18.36a1 1 0 0 1-1.41 0l-1.41-1.4a1 1 0 0 1 1.41-1.42l1.41 1.4a1 1 0 0 1 0 1.42zm10.5-14.14a1 1 0 0 1 1.41 0l1.41 1.4a1 1 0 0 1-1.41 1.42l-1.41-1.4a1 1 0 0 1 0-1.42z" />
  </svg>
);

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer darkMode={darkMode} onClick={toggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <ToggleCircle darkMode={darkMode}>
        {darkMode ? <MoonIcon /> : <SunIcon />}
      </ToggleCircle>
    </ToggleContainer>
  );
};

export default ThemeToggle;
