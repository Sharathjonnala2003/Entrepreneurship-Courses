import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../styles/CommonStyles';

const FooterContainer = styled.footer`
  background-color: var(--primary-dark);
  color: white;
  padding: 4rem 0 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
  
  a {
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const LogoPart1 = styled.span`
  color: var(--secondary-color); // Changed color for "Entrepreneur"
`;

const LogoPart2 = styled.span`
  color: white; // Kept "Hub" color the same
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: 0.75rem;
    
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color 0.3s ease;
      
      &:hover {
        color: var(--secondary-color);
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container>
        <FooterGrid>
          <FooterColumn>
            <FooterLogo>
              <Link to="/">
                <LogoPart1>Entrepreneur</LogoPart1><LogoPart2>Hub</LogoPart2>
              </Link>
            </FooterLogo>
            <FooterText>
              Empowering entrepreneurs with the knowledge and skills to turn innovative ideas into successful businesses. Join our community and start your entrepreneurial journey today.
            </FooterText>
            <SocialLinks>
              <SocialIcon href="#" aria-label="Facebook">f</SocialIcon>
              <SocialIcon href="#" aria-label="Twitter">t</SocialIcon>
              <SocialIcon href="#" aria-label="Instagram">i</SocialIcon>
              <SocialIcon href="#" aria-label="LinkedIn">in</SocialIcon>
            </SocialLinks>
          </FooterColumn>

          <FooterColumn>
            <h3>Quick Links</h3>
            <FooterLinks>
              <li><Link to="/courses">All Courses</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <h3>Categories</h3>
            <FooterLinks>
              <li><Link to="/courses?category=Business Strategy">Business Strategy</Link></li>
              <li><Link to="/courses?category=Marketing">Marketing</Link></li>
              <li><Link to="/courses?category=Finance">Finance</Link></li>
              <li><Link to="/courses?category=Leadership">Leadership</Link></li>
              <li><Link to="/courses?category=Innovation">Innovation</Link></li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <h3>Support</h3>
            <FooterLinks>
              <li><Link to="/contact">Help Center</Link></li>
              <li><Link to="/contact">FAQs</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
              <li><Link to="/contact">Terms of Service</Link></li>
            </FooterLinks>
          </FooterColumn>
        </FooterGrid>

        <Copyright>
          &copy; {currentYear} EntrepreneurHub. All rights reserved.
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
