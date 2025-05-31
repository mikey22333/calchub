import { createContext, useContext } from 'react';

// Create a context for theme-related functionality
// While we've removed dark mode, we'll keep the context for potential future theme options
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // We could add other theme-related functionality here in the future
  // For example, accent colors, font sizes, etc.

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
