import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Settings as LuxonSettings, Zone } from 'luxon';
import { HeaderFxProvider } from './context/HeaderFx';
import { ModalProvider } from './context/ModalContext';
import { NowProvider } from './context/Now';
import { SettingsProvider } from './context/Settings';
import useFeedbackFormUrl from './hooks/useFeedbackFom';
import Footer from './sections/App/Footer';
import Header from './sections/App/Header';
import { ShardIsBuggedTrigger } from './sections/Modals/BuggedShard';
import ShardCarousel from './sections/Shard/Carousel';

LuxonSettings.defaultLocale = 'en';

function ErrorFallback({ error }: FallbackProps) {
  const feedbackUrl = useFeedbackFormUrl({
    error,
    type: 'Bug',
  });
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center [&>*]:mb-2'>
      <h1 className='text-5xl' style={{ fontFamily: "'Caramel', cursive" }}>
        Sky Shards
      </h1>
      <p className='text-sm'>Sorry, the app crashed</p>
      <p className='text-sm'>Please submit a bug report</p>
      <div className='mt-2 flex flex-row flex-wrap items-center justify-center gap-2'>
        <a
          href={feedbackUrl}
          target='_blank'
          rel='noreferrer'
          className='whitespace-nowrap rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
        >
          <span className='text-sm font-bold '>Submit bug report</span>
        </a>
        <a
          href='https://v3.sky-shards.pages.dev'
          target='_blank'
          rel='noreferrer'
          className='whitespace-nowrap rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
        >
          <span className='text-sm font-bold '>Try the old version</span>
        </a>
      </div>
      <p>
        Sorry for the inconvenience, I will try to fix it as soon as possible. <br />
      </p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HeaderFxProvider>
        <SettingsProvider>
          <NowProvider>
            <ModalProvider>
              <ShardIsBuggedTrigger />
              <div className='absolute inset-1 flex flex-col flex-nowrap overflow-hidden'>
                <Header />
                <ShardCarousel />
                <Footer />
              </div>
            </ModalProvider>
          </NowProvider>
        </SettingsProvider>
      </HeaderFxProvider>
    </ErrorBoundary>
  );
}

export default App;
