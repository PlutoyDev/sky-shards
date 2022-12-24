import './App.css';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const [darkMode, setDarkMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));
  const appTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className='App'>
        <Header onThemeButtonClick={() => setDarkMode(!darkMode)} />
      </div>
    </ThemeProvider>
  );
}

export default App;
