import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Enhanced color palette with better contrast */
    --primary-color: #1e3a8a; /* Darker navy for better visibility and contrast */
    --primary-light: #3151a6; /* Light variant for hover states */
    --primary-dark: #142a66; /* Dark variant for active states */
    --secondary-color: #f59e0b; /* Warmer amber for better accessibility */
    --accent-color: #ef4444; /* Brighter red for important elements */
    --background-color: #f8fafc; /* Slightly warmer off-white */
    --text-color: #1e293b; /* Darker for better readability */
    --light-gray: #e2e8f0;
    --medium-gray: #94a3b8;
    --dark-gray: #475569;
    --white: #ffffff;
    --success: #10b981; /* For success messages */
    --error: #ef4444; /* For error states */
    --warning: #f59e0b; /* For warning messages */
    --info: #3b82f6; /* For informational elements */
    --gradient-primary: linear-gradient(135deg, #1e3a8a, #3151a6);
    --gradient-secondary: linear-gradient(135deg, #f59e0b, #fbbf24);
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --hover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.5);
    --transition-speed: 0.3s;
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    font-weight: var(--font-weight-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Improve keyboard focus styles for accessibility */
  a:focus, button:focus, input:focus, select:focus, textarea:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-md);
    line-height: 1.3;
    color: var(--text-color);
  }

  h1 {
    font-size: var(--font-size-4xl);
  }

  h2 {
    font-size: var(--font-size-3xl);
  }

  h3 {
    font-size: var(--font-size-2xl);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  section {
    padding: var(--spacing-2xl) 0;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: color var(--transition-speed) ease;
  }

  a:hover {
    color: var(--primary-light);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Better form element styling */
  input, textarea, select {
    font-size: var(--font-size-md);
    padding: var(--spacing-md);
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius-md);
    transition: border-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
    width: 100%;
  }

  input:focus, textarea:focus, select:focus {
    border-color: var(--primary-color);
    box-shadow: var(--focus-ring);
  }

  button {
    cursor: pointer;
    font-size: var(--font-size-md);
    transition: all var(--transition-speed) ease;
  }

  /* Helpful utility classes */
  .text-center {
    text-align: center;
  }

  .hidden {
    display: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Animation keyframes */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    h1 {
      font-size: var(--font-size-3xl);
    }
    
    h2 {
      font-size: var(--font-size-2xl);
    }
    
    h3 {
      font-size: var(--font-size-xl);
    }
  }
`;

export default GlobalStyles;
