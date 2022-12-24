import { useState, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './components/Header';
import { SettingsProvider } from './context/Settings';
import Home from './pages/Home';
import './App.css';

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
    <SettingsProvider value={{ isTwelveHourMode: twelveHourMode }}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Header
            onThemeButtonClick={() => setDarkMode(!darkMode)}
            onClockButtonClick={() => setTwelveHourMode(!twelveHourMode)}
          />
          <div className='App'>
            <Home />
          </div>
        </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
