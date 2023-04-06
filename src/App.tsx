import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { HeaderFxConsumer, HeaderFxProvider } from './context/HeaderFx';
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
  const [lightMode, setLightMode] = useLocalStorageState(
    'lightMode',
    useMediaQuery({ query: '(prefers-color-scheme: light)' }),
  );
  const compactMode = useMediaQuery({ maxWidth: '300px' });

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [lightMode]);

  return (
    <HeaderFxProvider>
      <SettingsProvider
        value={{ isTwelveHourMode: twelveHourMode, isLightMode: lightMode, isCompactMode: compactMode }}
      >
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
    </HeaderFxProvider>
  );
}

export default App;
