import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/CommonStyles';

const QuizContainer = styled.div`
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--card-shadow);
`;

const QuizHeader = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const QuestionCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const QuestionText = styled.h4`
  margin-bottom: 1.5rem;
  color: var(--primary-color);
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--medium-gray)'};
  border-radius: 8px;
  cursor: pointer;
  background-color: ${props => props.selected ? 'rgba(26, 26, 64, 0.05)' : 'white'};
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(26, 26, 64, 0.05)' : 'var(--light-gray)'};
  }
`;

const RadioButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--medium-gray)'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const ResultContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${props => props.success ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
  border-radius: 8px;
  margin-top: 1.5rem;
  
  h3 {
    color: ${props => props.success ? '#28a745' : '#dc3545'};
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--light-gray);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Quiz = ({ quizData, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestion] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      quizData.questions.forEach((question, index) => {
        if (selectedOptions[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const finalScore = Math.round((correctAnswers / quizData.questions.length) * 100);
      setScore(finalScore);
      setQuizCompleted(true);

      // Notify parent component
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOptions([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  if (quizCompleted) {
    const passed = score >= quizData.passingScore;

    return (
      <QuizContainer>
        <QuizHeader>
          <h3>{quizData.title} - Results</h3>
        </QuizHeader>

        <ResultContainer success={passed}>
          <h3>{passed ? 'Congratulations!' : 'Not Quite There Yet'}</h3>
          <p>Your score: {score}% (Passing score: {quizData.passingScore}%)</p>

          <p>
            You answered {selectedOptions.filter((option, index) =>
              option === quizData.questions[index].correctAnswer
            ).length} out of {quizData.questions.length} questions correctly.
          </p>

          <Button
            onClick={resetQuiz}
            primary={!passed}
            secondary={passed}
          >
            {passed ? 'Retake Quiz' : 'Try Again'}
          </Button>
        </ResultContainer>
      </QuizContainer>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <QuizContainer>
      <QuizHeader>
        <h3>{quizData.title}</h3>
        <p>Question {currentQuestion + 1} of {quizData.questions.length}</p>
      </QuizHeader>

      <ProgressBar>
        <Progress value={progress} />
      </ProgressBar>

      <QuestionCard>
        <QuestionText>{question.text}</QuestionText>

        <OptionsList>
          {question.options.map((option, index) => (
            <OptionItem
              key={index}
              selected={selectedOptions[currentQuestion] === index}
              onClick={() => handleOptionSelect(index)}
            >
              <RadioButton selected={selectedOptions[currentQuestion] === index} />
              <span>{option}</span>
            </OptionItem>
          ))}
        </OptionsList>
      </QuestionCard>

      <ActionButtons>
        <Button
          onClick={handlePrevious}
          secondary
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          primary
          disabled={selectedOptions[currentQuestion] === undefined}
        >
          {currentQuestion === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </ActionButtons>
    </QuizContainer>
  );
};

export default Quiz;
