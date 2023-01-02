import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import useLocalStorageState from './hooks/useLocalStorageState';
import Footer from './sections/App/Footer';
import Header from './sections/App/Header';

function App() {
  const [twelveHourMode, setTwelveHourMode] = useLocalStorageState(
    'twelveHourMode',
    Intl.DateTimeFormat().resolvedOptions().hour12 ?? false,
  );
  const [lightMode, setLightMode] = useLocalStorageState('lightMode', useMediaQuery('(prefers-color-scheme: light)'));
  const compactMode = useMediaQuery('(max-width: 300px)');

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [lightMode]);

  return (
    <SettingsProvider value={{ isTwelveHourMode: twelveHourMode, isLightMode: lightMode, isCompactMode: compactMode }}>
      <NowProvider>
        <div className='App'>
          <Header
            onThemeButtonClick={() => setLightMode(!lightMode)}
            onClockButtonClick={() => setTwelveHourMode(!twelveHourMode)}
          />
          <Outlet />
          <Footer />
        </div>
      </NowProvider>
    </SettingsProvider>
  );
}

export default App;
