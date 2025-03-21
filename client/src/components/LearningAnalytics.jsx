import React from 'react';
import styled from 'styled-components';

const AnalyticsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--card-shadow);
`;

const AnalyticsTitle = styled.h3`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: var(--light-gray);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const ChartSection = styled.div`
  margin-top: 2rem;
`;

const ChartTitle = styled.h4`
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const WeeklyProgressChart = styled.div`
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 8px;
`;

const DayBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Bar = styled.div`
  width: 100%;
  background-color: var(--primary-color);
  height: ${props => props.height}%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
`;

const DayLabel = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: var(--dark-gray);
`;

const LearningAnalytics = ({ stats, weeklyProgress }) => {
  return (
    <AnalyticsContainer>
      <AnalyticsTitle>Your Learning Analytics</AnalyticsTitle>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.hoursThisWeek}</StatValue>
          <StatLabel>Hours This Week</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>Completion Rate</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>Day Streak</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{stats.quizScore}%</StatValue>
          <StatLabel>Avg. Quiz Score</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <ChartTitle>This Week's Learning Activity</ChartTitle>
        <WeeklyProgressChart>
          {weeklyProgress.map((day, index) => (
            <DayBar key={index}>
              <Bar height={day.percent} />
              <DayLabel>{day.day}</DayLabel>
            </DayBar>
          ))}
        </WeeklyProgressChart>
      </ChartSection>
    </AnalyticsContainer>
  );
};

export default LearningAnalytics;
