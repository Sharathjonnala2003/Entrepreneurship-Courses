import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Container } from '../styles/CommonStyles';

const Nav = styled.nav`
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 0;
`;

const NavbarInner = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  h1 {
    font-size: inherit;
    margin: 0;
    line-height: 1;
  }
  
  span {
    color: var(--primary-color);
  }
  
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--primary-color);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 250px;
    background-color: var(--white);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 10;
    
    &.active {
      transform: translateX(0);
    }
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 992px) {
    margin-bottom: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
  font-weight: var(--font-weight-medium);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  &:hover, &.active {
    color: var(--primary-color);
    
    &::after {
      width: 100%;
    }
  }
  
  &.active {
    font-weight: var(--font-weight-semibold);
  }
  
  @media (max-width: 992px) {
    padding: 0.5rem 0;
    width: 100%;
    
    &::after {
      bottom: -2px;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 992px) {
    margin-left: auto;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SignInButton = styled(Link)`
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(30, 58, 138, 0.05);
    transform: translateY(-2px);
  }
`;

const SignUpButton = styled(Link)`
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
  z-index: 15;
  
  @media (max-width: 992px) {
    display: block;
  }
`;

const Hamburger = styled.div`
  width: 24px;
  height: 20px;
  position: relative;
  margin: auto;
  
  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: var(--text-color);
    border-radius: 10px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: all 0.25s ease-in-out;
    
    &:nth-child(1) {
      top: 0px;
    }
    
    &:nth-child(2) {
      top: 9px;
    }
    
    &:nth-child(3) {
      top: 18px;
    }
  }
  
  &.active {
    span:nth-child(1) {
      top: 9px;
      transform: rotate(135deg);
    }
    
    span:nth-child(2) {
      opacity: 0;
      left: -60px;
    }
    
    span:nth-child(3) {
      top: 9px;
      transform: rotate(-135deg);
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  span:first-of-type {
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
  }
  
  span:last-child {
    color: var(--dark-gray);
    transition: transform 0.3s ease;
    
    ${props => props.open && `
      transform: rotate(180deg);
    `}
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--card-shadow);
  width: 220px;
  padding: 0.5rem;
  z-index: 10;
  transform-origin: top right;
  transform: scale(${props => props.show ? 1 : 0.95});
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--dark-gray);
  }
  
  &:hover {
    background-color: var(--light-gray);
  }
  
  &.danger {
    color: var(--error);
    
    svg {
      color: var(--error);
    }
  }
`;

const RoleIndicator = styled.div`
  font-size: var(--font-size-xs);
  background-color: ${props => props.admin ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.admin ? 'var(--error)' : 'var(--success)'};
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  margin-left: auto;
  font-weight: var(--font-weight-medium);
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--card-shadow);
  width: 220px;
  padding: 0.5rem;
  z-index: 10;
  transform-origin: top right;
  transform: scale(${props => props.show ? 1 : 0.95});
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: transform 0.2s ease, opacity 0.2s ease, visibility 0.2s ease;
`;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname; // Now using location properly

  // Close menus when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const closeMenus = (e) => {
      if (!e.target.closest('#user-menu')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Nav>
      <NavbarInner>
        <Logo to="/">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 3.6C10.0589 3.6 3.6 10.0589 3.6 18C3.6 25.9411 10.0589 32.4 18 32.4C25.9411 32.4 32.4 25.9411 32.4 18C32.4 10.0589 25.9411 3.6 18 3.6ZM18 7.2C21.5823 7.2 24.5662 9.4173 25.8962 12.6H10.1038C11.4338 9.4173 14.4177 7.2 18 7.2ZM9 16.2H27C27.1212 16.7825 27.1864 17.3846 27.1864 18C27.1864 18.6154 27.1212 19.2175 27 19.8H9C8.87876 19.2175 8.81356 18.6154 8.81356 18C8.81356 17.3846 8.87876 16.7825 9 16.2ZM18 28.8C14.4177 28.8 11.4338 26.5827 10.1038 23.4H25.8962C24.5662 26.5827 21.5823 28.8 18 28.8Z" fill="currentColor" />
          </svg>
          <h1>Entrepreneur<span>Hub</span></h1>
        </Logo>

        <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
          <Hamburger className={mobileMenuOpen ? 'active' : ''}>
            <span></span>
            <span></span>
            <span></span>
          </Hamburger>
        </MobileMenuButton>

        <MobileOverlay className={mobileMenuOpen ? 'active' : ''} onClick={toggleMobileMenu} />

        <NavLinks className={mobileMenuOpen ? 'active' : ''}>
          <NavItem>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/courses" className={isActive('/courses') ? 'active' : ''}>
              Courses
            </NavLink>
          </NavItem>
          {user && (
            <NavItem>
              <NavLink to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
                Calendar
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </NavLink>
          </NavItem>
          <NavItem active={pathname === '/events'}>
            <NavLink as={Link} to="/events">Events</NavLink>
          </NavItem>

          <NavItem active={pathname === '/mentorship'}>
            <NavLink as={Link} to="/mentorship">Mentorship</NavLink>
          </NavItem>
        </NavLinks>

        <NavActions>
          {user ? (
            <UserMenu id="user-menu">
              <UserButton onClick={toggleUserMenu} open={userMenuOpen}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <UserAvatar>{getInitials(user.name)}</UserAvatar>
                )}
                <span>{user.name.split(' ')[0]}</span>
                <span>▼</span>
              </UserButton>
              <UserDropdown show={userMenuOpen}>
                <DropdownItem onClick={() => navigate('/dashboard')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1zM13 4v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1z" />
                  </svg>
                  Dashboard
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z" />
                  </svg>
                  My Profile
                  {user.role === 'admin' && <RoleIndicator admin>Admin</RoleIndicator>}
                </DropdownItem>
                {isAdmin() && (
                  <DropdownItem onClick={() => navigate('/admin-dashboard')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Admin Dashboard
                  </DropdownItem>
                )}
                <DropdownItem className="danger" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm-1-8h2v2h4v12h-4v2h-2v2H2v-2h11v-4h1v-1h-1v-7H2V4h13z" />
                  </svg>
                  Logout
                </DropdownItem>
              </UserDropdown>
            </UserMenu>
          ) : (
            <AuthButtons>
              <SignInButton to="/login">Sign In</SignInButton>
              <SignUpButton to="/signup">Sign Up</SignUpButton>
            </AuthButtons>
          )}
        </NavActions>
      </NavbarInner>
    </Nav>
  );
};

export default Navbar;