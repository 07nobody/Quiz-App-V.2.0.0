import { createSlice } from '@reduxjs/toolkit';

// Get initial theme from localStorage if available
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      
      // Update localStorage
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      
      // Update document attribute for CSS variables
      if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload;
      
      // Update localStorage
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      
      // Update document attribute for CSS variables
      if (state.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;