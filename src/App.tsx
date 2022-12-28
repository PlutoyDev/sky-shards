import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import router from './Router';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import useLocalStorageState from './hooks/useLocalStorageState';
import Footer from './sections/App/Footer';
import Header from './sections/App/Header';
import './App.css';

function App() {
  const [twelveHourMode, setTwelveHourMode] = useLocalStorageState('twelveHourMode', false);
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
        <Header
          onThemeButtonClick={() => setLightMode(!lightMode)}
          onClockButtonClick={() => setTwelveHourMode(!twelveHourMode)}
        />
        <div className='App'>
          <RouterProvider router={router} />
        </div>
        <Footer />
      </NowProvider>
    </SettingsProvider>
  );
}

export default App;
