import './App.css';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const [twelveHourMode, setTwelveHourMode] = useState(false);
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
      <Header
        isTwelve={twelveHourMode}
        onThemeButtonClick={() => setDarkMode(!darkMode)}
        onClockButtonClick={() => setTwelveHourMode(!twelveHourMode)}
      />
      <div className='App'></div>
    </ThemeProvider>
  );
}

export default App;
