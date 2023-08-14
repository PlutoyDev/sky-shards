import { ReactNode, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import { patternCredits } from '../../data/credits';
import useFeedbackFormUrl from '../../hooks/useFeedbackFom';

interface SubFooterProps {
  key: string;
  className?: string;
  children: ReactNode;
}

function SubFooter({ key, className, children }: SubFooterProps) {
  return (
    <div key={key} className={`max-w-full ${className}`} style={{ height: 'calc(100% - 4rem)' }}>
      {children}
    </div>
  );
}

function AppDetailFooter() {
  const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';

  const feedbackUrl = useFeedbackFormUrl();
  return (
    <SubFooter key='app-detail' className='flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-3'>
      <div>
        <p className='text-center text-sm'>Created by: Plutoy#5022</p>
        <p className='text-center'>Version: {version}</p>
      </div>
      <div className='mt-1 flex flex-row flex-wrap items-center justify-center gap-1'>
        <a
          href='https://github.com/PlutoyDev/sky-shards'
          target='_blank'
          rel='noreferrer'
          className='rounded-xl bg-black px-2 pb-1 pt-0.5 text-white'
        >
          <BsGithub className='text-md mr-2 inline-block' />
          <span className='text-sm font-bold max-xs:hidden'>Source on</span>
          <span className='text-sm font-bold '>GitHub</span>
        </a>
        <a
          href={feedbackUrl}
          target='_blank'
          rel='noreferrer'
          className='rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
        >
          <TbForms className='text-md mr-2 inline-block' />
          <span className='text-sm font-bold max-xs:hidden'>Submit</span>
          <span className='text-sm font-bold '>Feedback</span>
        </a>
      </div>
    </SubFooter>
  );
}

function PattenCreditFooter() {
  return (
    <SubFooter key='patten-credit' className='flex flex-col items-center justify-center gap-y-1'>
      <p className='text-center max-sm:text-[10px] sm:text-sm'>
        Thanks to these Discord users for aiding in discovering shard eruption patterns:
      </p>
      <p className='flex w-full select-none flex-row flex-wrap items-center justify-center gap-x-1.5 whitespace-nowrap max-sm:text-xs'>
        {patternCredits.map(u => (
          <span key={u}>{u}</span>
        ))}
      </p>
      <div className='flex-1' />
      <p className='text-center max-xs:hidden xs:text-[8px] md:text-xs'>
        <span>This website is not affiliated with thatgamecompany or </span>
        <span className='whitespace-nowrap'>Sky: Children of the Light. </span>
        <span className='whitespace-nowrap max-sm:hidden'>(It might not reflect what is in-game)</span>
      </p>
    </SubFooter>
  );
}

function InspiredByFooter() {
  return (
    <SubFooter key='inspiration' className='flex flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-3'>
      <p>The creation of Sky Shard was inspired by:</p>
      <a
        target='_blank'
        rel='noreferrer'
        href='https://sky-clock.netlify.app/'
        className='z-10 grid cursor-pointer grid-rows-2 rounded-lg border border-zinc-500 px-2 text-center shadow-2xl shadow-zinc-700  '
        style={{ gridTemplateColumns: 'max-content min-content max-content' }}
      >
        <img className='ml-auto mt-1.5 h-4 w-4' src='/ext/sky-clock.png' />
        <h2 className='mx-2 whitespace-nowrap text-center'>
          <span className='text-sm underline'>Sky Clock</span>
          <span className='text-xs'> by Chris Stead</span>
        </h2>
        <BiLinkExternal className='mt-1.5 self-start' />
        <p className='col-span-3 whitespace-normal text-xs'>
          Visit it for timing of Geyser, Grandma, Turtle and many more
        </p>
      </a>
    </SubFooter>
  );
}

const subfooters = [AppDetailFooter, PattenCreditFooter, InspiredByFooter] as const;
const numSubfooters = subfooters.length;
const durationPerSection = 5; // seconds

interface FooterProps {}

export function Footer({}: FooterProps) {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % subfooters.length);
      console.log('interval');
    }, durationPerSection * 1000);
    return () => clearInterval(interval);
  }, []);

  const transY = (-100 / numSubfooters) * currentSection;

  return (
    <footer className='glass mx-auto w-full overflow-y-hidden !py-0'>
      <div
        className='flex w-full flex-col items-center justify-evenly transition-transform'
        style={{
          height: numSubfooters * 100 + '%',
          transform: `translateY(${transY}%)`,
        }}
      >
        {subfooters.map(Footer => (
          <Footer />
        ))}
      </div>
    </footer>
  );
}

export default Footer;
