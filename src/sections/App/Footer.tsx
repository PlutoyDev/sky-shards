import { useRef, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import { patternCredits } from '../../data/credits';
import useFeedbackFormUrl from '../../hooks/useFeedbackFom';

const SkyClockImg = <img className='ml-auto mt-1.5 h-4 w-4' src='/ext/sky-clock.png' />;

const subfooters = [
  () => {
    const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';
    const branchName = import.meta.env.VITE_GIT_BRANCH ?? 'undefiend';
    const commitSha = import.meta.env.VITE_GIT_COMMIT ?? 'undefiend';

    const feedbackUrl = useFeedbackFormUrl();

    return (
      <div
        className='flex h-full max-w-full flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-3'
        key='social-links'
      >
        <div>
          <p className='text-center text-sm'>Created by: Plutoy#5022</p>
          <p className='flex justify-center gap-2 text-sm'>
            <span>Version:</span>
            <a
              target='_blank'
              rel='noreferrer'
              className='underline'
              href={`https://github.com/PlutoyDev/sky-shards/commits/${branchName}`}
            >
              <span>{version} </span>
              <span className='hidden lg:inline'>
                ({branchName}-{commitSha.slice(0, 7)})
                <BiLinkExternal className='inline' width='0.8em' height='0.8em' />
              </span>
            </a>
          </p>
        </div>
        <div className='mt-1 flex max-w-fit flex-row flex-wrap items-center justify-center gap-1'>
          <a
            href='https://github.com/PlutoyDev/sky-shards'
            target='_blank'
            rel='noreferrer'
            className=' rounded-xl bg-black px-2 pb-1 pt-0.5 text-white'
          >
            <BsGithub className='text-md mr-2 inline-block' />
            <span className='text-sm font-bold '>Source on GitHub</span>
          </a>
          <a
            href={feedbackUrl}
            target='_blank'
            rel='noreferrer'
            className='rounded-xl bg-purple-700 px-2 pb-1 pt-0.5 text-white'
          >
            <TbForms className='text-md mr-2 inline-block' />
            <span className='text-sm font-bold '>Submit Feedback</span>
          </a>
        </div>
      </div>
    );
  },
  () => (
    <div key='credits' className='flex h-full flex-col items-center justify-around gap-y-1'>
      <div>
        <p className='text-center text-xs md:text-sm'>
          Thank you to the following Discord users who helped to discover the patterns shard eruption:
        </p>
        <p className='flex w-full select-none flex-row flex-wrap items-center justify-center gap-x-1.5 overflow-hidden whitespace-nowrap text-xs'>
          {patternCredits.map(u => (
            <span key={u}>{u}</span>
          ))}
        </p>
      </div>
      <p className='text-center text-[8px] md:text-xs'>
        <span>This website is not affiliated with thatgamecompany or </span>
        <span className='whitespace-nowrap'>Sky: Children of the Light. </span>
        <span className='whitespace-nowrap'>(It might not reflect what is in-game)</span>
      </p>
    </div>
  ),
  () => (
    <div
      key='inspiration'
      className='flex h-full max-h-full flex-row flex-wrap items-center justify-center gap-x-1 lg:gap-x-3'
    >
      <p>The creation of Sky Shard was inspired by:</p>
      <a
        target='_blank'
        rel='noreferrer'
        href='https://sky-clock.netlify.com/'
        className='z-10 grid cursor-pointer grid-rows-2 rounded-lg border border-zinc-500 px-2 text-center shadow-2xl shadow-zinc-700  '
        style={{ gridTemplateColumns: 'max-content min-content max-content' }}
      >
        {SkyClockImg}
        <h2 className='mx-2 whitespace-nowrap text-center'>
          <span className='text-sm underline'>Sky Clock</span>
          <span className='text-xs'> by Chris Stead</span>
        </h2>
        <BiLinkExternal className='mt-1.5 self-start' />
        <p className='col-span-3 whitespace-normal text-xs'>
          Visit it for timing of Geyser, Grandma, Turtle and many more
        </p>
      </a>
    </div>
  ),
];

const durationPerSection = 5; // seconds
const durationCycle = durationPerSection * subfooters.length;

if (durationCycle > 300) {
  //5 minutes
  throw new Error('Footer cycle duration is too long');
}

const variants = {
  enter: {
    y: '-100%',
    opacity: 0,
  },
  center: {
    y: '0%',
    opacity: 1,
  },
  exit: {
    y: '100%',
    opacity: 0,
  },
};

export default function Footer() {
  const [displaySection, setDisplaySection] = useState(0);
  const footerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(
      () => footerEl.current?.matches(':hover') || setDisplaySection(sec => (sec + 1) % subfooters.length),
      durationPerSection * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  const SubFooter = subfooters[displaySection];

  return (
    <footer ref={footerEl} className='footer glass container mx-auto overflow-hidden'>
      <AnimatePresence initial={false} mode='popLayout'>
        <motion.div
          key={displaySection}
          variants={variants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className='h-full w-full'
        >
          <SubFooter />
        </motion.div>
      </AnimatePresence>
    </footer>
  );
}
