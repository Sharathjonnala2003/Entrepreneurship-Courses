import styled, { css } from "styled-components";
import { Link as RouterLink } from "react-router-dom";

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

// Updated Button component to fix boolean attribute warnings
export const Button = styled.button.attrs((props) => {
  // Filter out non-DOM props so they don't get passed to the DOM element
  const domProps = { ...props };
  ["primary", "secondary", "danger", "fullWidth", "small", "large"].forEach(
    (prop) => {
      delete domProps[prop];
    }
  );
  return domProps;
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    props.small ? "0.5rem 1rem" : props.large ? "1rem 2rem" : "0.75rem 1.5rem"};
  border-radius: 5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: ${(props) =>
    props.small ? "0.875rem" : props.large ? "1.125rem" : "1rem"};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  ${(props) =>
    props.primary &&
    css`
      background-color: var(--primary-color);
      color: white;
      border: 2px solid var(--primary-color);

      &:hover {
        background-color: #141432;
        border-color: #141432;
      }
    `}

  ${(props) =>
    props.secondary &&
    css`
      background-color: transparent;
      color: var(--primary-color);
      border: 2px solid var(--primary-color);

      &:hover {
        background-color: var(--primary-color);
        color: white;
      }
    `}
  
  ${(props) =>
    props.danger &&
    css`
      background-color: #dc3545;
      color: white;
      border: 2px solid #dc3545;

      &:hover {
        background-color: #c82333;
        border-color: #bd2130;
      }
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Link = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  transition: color var(--transition-speed) ease;

  &:hover {
    color: var(--primary-color);
  }
`;

export const ButtonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  line-height: 1.5;
  font-size: var(--font-size-md);
  white-space: nowrap;

  ${(props) =>
    props.primary &&
    `
    background-color: var(--primary-color);
    color: var(--white);

    &:hover, &:focus {
      background-color: var(--primary-light);
      color: var(--white);
      transform: translateY(-2px);
      box-shadow: var(--card-shadow);
    }
    
    &:active {
      background-color: var(--primary-dark);
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);

    &:hover, &:focus {
      background-color: rgba(30, 58, 138, 0.05);
      transform: translateY(-2px);
      box-shadow: var(--card-shadow);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${(props) =>
    props.outline &&
    `
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--medium-gray);

    &:hover, &:focus {
      border-color: var(--primary-color);
      color: var(--primary-color);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${(props) =>
    props.fullWidth &&
    `
    width: 100%;
  `}
  
  ${(props) =>
    props.small &&
    `
    padding: 0.375rem 0.75rem;
    font-size: var(--font-size-sm);
  `}
  
  ${(props) =>
    props.large &&
    `
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-lg);
  `}
  
  ${(props) =>
    props.hasIcon &&
    `
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      font-size: 1.2em;
    }
  `}
`;

export const Card = styled.div`
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform var(--transition-speed) ease,
    box-shadow var(--transition-speed) ease;

  &:hover {
    box-shadow: var(--hover-shadow);
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;

  ${(props) =>
    props.primary &&
    `
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--primary-color);
  `}

  ${(props) =>
    props.secondary &&
    `
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--secondary-color);
  `}
  
  ${(props) =>
    props.success &&
    `
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--success);
  `}
  
  ${(props) =>
    props.danger &&
    `
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--error);
  `}
  
  ${(props) =>
    props.outline &&
    `
    background-color: transparent;
    border: 1px solid currentColor;
  `}
`;

export const Alert = styled.div`
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  font-weight: var(--font-weight-medium);

  ${(props) =>
    props.success &&
    `
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--success);
    border-left: 4px solid var(--success);
  `}

  ${(props) =>
    props.danger &&
    `
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--error);
    border-left: 4px solid var(--error);
  `}
  
  ${(props) =>
    props.warning &&
    `
    background-color: rgba(245, 158, 11, 0.1);
    color: var(--warning);
    border-left: 4px solid var(--warning);
  `}
  
  ${(props) =>
    props.info &&
    `
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--info);
    border-left: 4px solid var(--info);
  `}
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);

  h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: var(--primary-color);
      border-radius: 3px;
    }
  }

  p {
    font-size: var(--font-size-lg);
    color: var(--dark-gray);
    max-width: 600px;
    margin: var(--spacing-lg) auto 0;
  }
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: var(--light-gray);
  margin: var(--spacing-lg) 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 3}, 1fr);
  gap: ${(props) => props.gap || "1.5rem"};

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(30, 58, 138, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin: ${(props) => (props.center ? "0 auto" : "0")};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  input,
  textarea,
  select {
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
