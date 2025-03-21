import React from 'react';
import styled from 'styled-components';

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  text-align: center;
  
  .badge-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: ${props => props.unlocked ? 'var(--primary-color)' : 'var(--light-gray)'};
    color: ${props => props.unlocked ? 'white' : 'var(--medium-gray)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: ${props => props.unlocked ? 1 : 0.5};
  }
  
  .badge-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--dark-gray);
  }
  
  .badge-description {
    font-size: 0.8rem;
    color: var(--medium-gray);
  }
`;

const GamificationBadges = ({ badges }) => {
  return (
    <BadgesContainer>
      {badges.map((badge, index) => (
        <Badge key={index} unlocked={badge.unlocked}>
          <div className="badge-icon">{badge.icon}</div>
          <div className="badge-name">{badge.name}</div>
          <div className="badge-description">{badge.description}</div>
        </Badge>
      ))}
    </BadgesContainer>
  );
};

export default GamificationBadges;
