import { HeaderFxProvider } from './context/HeaderFx';
import { ModalProvider } from './context/ModalContext';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import Footer from './sections/App/Footer';
import Header from './sections/App/Header';
import ShardCarousel from './sections/Shard/Carousel';

function App() {
  return (
    <HeaderFxProvider>
      <SettingsProvider>
        <NowProvider>
          <ModalProvider>
            <div className='App'>
              <Header />
              <ShardCarousel />
              <Footer />
            </div>
          </ModalProvider>
        </NowProvider>
      </SettingsProvider>
    </HeaderFxProvider>
  );
}

export default App;
