import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Outlet } from 'react-router-dom';
import { HeaderFxConsumer, HeaderFxProvider } from './context/HeaderFx';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import useLocalStorageState from './hooks/useLocalStorageState';
import Footer from './sections/App/Footer';
import Header from './sections/App/Header';

function App() {
  const [twelveHourModeSetting, setTwelveHourModeSetting] = useLocalStorageState('twelveHourMode', 'system');
  const [lightMode, setLightMode] = useLocalStorageState<'false' | 'true' | 'system'>('lightMode', 'system');
  const compactMode = useMediaQuery({ maxWidth: '300px' });

  const twelveHourMode =
    twelveHourModeSetting === 'system'
      ? Intl.DateTimeFormat().resolvedOptions().hour12 ?? false
      : twelveHourModeSetting === 'true';

  const boolLightMode =
    lightMode === 'true' || (lightMode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (lightMode === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
      }
    } else if (lightMode === 'true') {
      document.body.classList.add('light');
    } else if (lightMode === 'false') {
      document.body.classList.remove('light');
    }
  }, [lightMode]);

  return (
    <HeaderFxProvider>
      <SettingsProvider
        value={{ isTwelveHourMode: twelveHourMode, isLightMode: boolLightMode, isCompactMode: compactMode }}
      >
        <NowProvider>
          <div className='App'>
            <Header
              setTwelveHourModeSetting={setTwelveHourModeSetting}
              setLightMode={setLightMode}
              twelveHourModeSetting={twelveHourModeSetting}
              lightMode={lightMode}
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
