import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './components/Header';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import useLocalStorageState from './hooks/useLocalStorageState';
import Home from './pages/Home';
import './App.css';

function App() {
  const [twelveHourMode, setTwelveHourMode] = useState(false);
  const [lightMode, setLightMode] = useLocalStorageState('lightMode', useMediaQuery('(prefers-color-scheme: light)'));
  // const [darkMode, setDarkMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [lightMode]);

  return (
    <SettingsProvider value={{ isTwelveHourMode: twelveHourMode, isLightMode: lightMode }}>
      <NowProvider>
        <Header
          onThemeButtonClick={() => setLightMode(!lightMode)}
          onClockButtonClick={() => setTwelveHourMode(!twelveHourMode)}
        />
        <div className='App'>
          <Home />
        </div>
      </NowProvider>
    </SettingsProvider>
  );
}

export default App;
