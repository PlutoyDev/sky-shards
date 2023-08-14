import { ReactNode, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import useFeedbackFormUrl from '../../hooks/useFeedbackFom';

interface SubFooterProps {
  key: string;
  className?: string;
  children: ReactNode;
}

function SubFooter({ key, className, children }: SubFooterProps) {
  return (
    <div key={key} className={`carousel-item h-full ${className}`}>
      {children}
    </div>
  );
}

function AppDetailFooter() {
  const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';

  const feedbackUrl = useFeedbackFormUrl();
  return (
    <SubFooter
      key='app-detail'
      className='grid auto-cols-fr grid-flow-col grid-cols-2 place-items-center max-md:grid-rows-2 md:px-[calc((50%-7rem)/2)] '
    >
      <div className='max-md:col-span-2'>
        <p className='text-center text-sm'>Created by: Plutoy#5022</p>
        <p className='flex justify-center gap-2 text-sm'>Version: {version}</p>
      </div>
      <a
        href='https://github.com/PlutoyDev/sky-shards'
        target='_blank'
        rel='noreferrer'
        className=' whitespace-nowrap rounded-xl bg-black px-2 pb-1 pt-0.5 text-white'
      >
        <BsGithub className='text-md mr-2 inline-block' />
        <span className='text-sm font-bold '>Source on GitHub</span>
      </a>
      <a
        href={feedbackUrl}
        target='_blank'
        rel='noreferrer'
        className='whitespace-nowrap rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
      >
        <TbForms className='text-md mr-2 inline-block' />
        <span className='text-sm font-bold '>Submit Feedback</span>
      </a>
    </SubFooter>
  );
}

const subfooters = [AppDetailFooter];
const durationPerSection = 5; // seconds
const durationCycle = durationPerSection * subfooters.length;

interface FooterProps {}

export function Footer({}: FooterProps) {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % subfooters.length);
    }, durationPerSection * 1000);
    return () => clearInterval(interval);
  }, []);

  const CurrentFooter = subfooters[currentSection];

  return (
    <footer className='carousel carousel-vertical glass mx-auto w-full'>
      <CurrentFooter />
    </footer>
  );
}

export default Footer;
