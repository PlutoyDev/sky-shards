import { useRef, useEffect, useState, useMemo } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import { patternCredits } from '../../data/credits';

const subfooters = [
  () => (
    <div key='credits' className='flex h-full flex-col items-center justify-around gap-y-1'>
      <div>
        <p className='text-center text-sm'>Thank you to those who helped to discover the patterns shard eruption:</p>
        <p className='flex w-fit flex-row flex-wrap justify-center gap-x-1.5 overflow-hidden whitespace-nowrap text-xs '>
          {patternCredits.map(u => {
            if (u.includes('#')) {
              const [name, tag] = u.split('#');
              return (
                <p key={u}>
                  <span>{name}</span>
                  <span className='hidden md:inline'>#{tag}</span>
                </p>
              );
            } else return <p key={u}>{u}</p>;
          })}
        </p>
      </div>
      <p className='text-center text-[8px] md:text-xs'>
        <span>This website is not affiliated with thatgamecompany or </span>
        <span className='whitespace-nowrap'>Sky: Children of the Light.</span>
        <span className='whitespace-nowrap'>(It might not reflect what is in-game)</span>
      </p>
    </div>
  ),
  () => (
    <div key='inspiration' className='flex h-full max-h-full flex-col flex-wrap items-center justify-around'>
      <p>The creation of Sky Shard was inspired by:</p>
      <button
        className='z-10 grid cursor-pointer grid-rows-2 rounded-lg border border-zinc-500 px-2 text-center shadow-2xl shadow-zinc-700  '
        style={{ gridTemplateColumns: 'max-content min-content max-content' }}
        onClick={e => (e.preventDefault(), window.open('https://sky-clock.netlify.com/', '_blank'))}
      >
        {useMemo(
          () => (
            <img className='emoji ml-auto mt-1.5 block' src='/ext/sky-clock.png' />
          ),
          [],
        )}
        <h2 className='mx-2 whitespace-nowrap text-center'>
          <span className='text-sm underline'>Sky Clock</span>
          <span className='text-xs'> by Chris Stead</span>
        </h2>
        <BiLinkExternal className='mt-1.5 self-start' />
        <p className='col-span-3 whitespace-normal text-xs'>
          Visit it for timing of Geyser, Grandma, Turtle and many more
        </p>
      </button>
    </div>
  ),
  () => {
    const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';
    const branchName = import.meta.env.VITE_GIT_BRANCH ?? 'undefiend';
    const commitSha = import.meta.env.VITE_GIT_COMMIT ?? 'undefiend';
    return (
      <div className='flex h-full max-w-full flex-col flex-wrap justify-around' key='social-links'>
        <div>
          <p className='text-center text-sm'>Created by: Plutoy#5022</p>
          <p className='flex justify-center gap-2 text-sm'>
            <span>Version: {version}</span>
            <span className='hidden md:block'>
              Branch: <a href={`https://github.com/PlutoyDev/sky-shards/tree/${branchName}`}>{branchName}</a> (
              <a href={`https://github.com/PlutoyDev/sky-shards/commit/${commitSha}`}>{commitSha}</a>)
            </span>
          </p>
        </div>
        <div className='mx-auto mt-1 flex max-w-fit flex-row flex-wrap items-center justify-center gap-1'>
          <button
            className=' rounded-xl bg-black px-2 pt-0.5 pb-1 text-white'
            onClick={e => (e.preventDefault(), window.open('https://github.com/PlutoyDev/sky-shards', '_blank'))}
          >
            <BsGithub className='text-md mr-2 inline-block' />
            <span className='text-sm font-bold '>Source on GitHub</span>
          </button>
          <button
            className='rounded-xl bg-purple-700 px-2 pt-0.5 pb-1 text-white'
            onClick={e => {
              e.preventDefault();
              const size = window.innerWidth + 'x' + window.innerHeight;
              const baseLink =
                'https://docs.google.com/forms/d/e/1FAIpQLSf8CvIDxHz9hFkzaK-CFsGDKqIjiuAt4IDzigI8WjQnNBx6Ww/viewform';

              const params = new URLSearchParams();
              params.append('usp', 'pp_url');
              params.append(
                'entry.402545620',
                `--App related--\nVersion: ${version}\nBranch: ${branchName}\nCommit: ${commitSha}\n--Device related (Feel free to delete it)--\n` +
                  `Size: ${size}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
              );

              window.open(`${baseLink}?${params.toString()}`, '_blank');
            }}
          >
            <TbForms className='text-md mr-2 inline-block' />
            <span className='text-sm font-bold '>Submit Feedback</span>
          </button>
          {/* <button
            className='rounded-xl bg-yellow-400 text-black'
            onClick={e => (e.preventDefault(), window.open('https://www.buymeacoffee.com/plutoy', '_blank'))}
          >
            {useMemo(
              () => (
                <img
                  className='m-0 inline h-7 w-32 rounded-xl p-0'
                  src='https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=plutoy&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff'
                />
              ),
              [],
            )}
          </button> */}
        </div>
      </div>
    );
  },
];

const durationPerSection = 10; // seconds
const durationCycle = durationPerSection * subfooters.length;

if (durationCycle > 300) {
  //5 minutes
  throw new Error('Footer cycle duration is too long');
}

const variants = {
  enter: {
    x: -1000,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: 1000,
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
      <AnimatePresence initial={false} mode='wait'>
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
