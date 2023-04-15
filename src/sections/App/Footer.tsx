import { useRef, useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsGithub } from 'react-icons/bs';
import { TbForms } from 'react-icons/tb';
import { AnimatePresence, motion } from 'framer-motion';
import { patternCredits } from '../../data/credits';

const subfooters = [
  () => (
    <motion.div key='credits' className='flex flex-col gap-y-1 items-center'>
      <p>Thank you to those who helped to discover the patterns shard eruption:</p>
      <div className='flex flex-row flex-wrap gap-x-1.5 text-xs whitespace-nowrap w-fit overflow-hidden text-slate-200 justify-center'>
        {patternCredits.map(u => (
          <span key={u}>{u}</span>
        ))}
      </div>
    </motion.div>
  ),
  () => (
    <motion.div key='inspiration' className='flex flex-col items-center'>
      <p>The creation of Sky Shard was inspired by:</p>
      <button
        className='text-center glass grid grid-rows-2 cursor-pointer'
        style={{ gridTemplateColumns: 'min-content max-context min-content' }}
        onClick={e => (e.preventDefault(), window.open('https://sky-clock.netlify.com/', '_blank'))}
      >
        <img className='emoji ml-auto block mt-1.5' src='/ext/sky-clock.png' />
        <h2 className='text-center'>
          <span className='text-sm underline'>Sky Clock</span>
          <span className='text-xs'> by Chris Stead</span>
        </h2>
        <BiLinkExternal className='self-start mt-1.5' />
        <p className='text-xs col-span-3 whitespace-normal'>
          Visit it for timing of Geyser, Grandma, Turtle and many more
        </p>
      </button>
      <hr className='min-h-full m-0' />
    </motion.div>
  ),
  () => {
    const version = import.meta.env.VITE_VERSION_MINOR ?? 'undefiend';
    const branchName = import.meta.env.VITE_GIT_BRANCH ?? 'undefiend';
    const commitSha = import.meta.env.VITE_GIT_COMMIT ?? 'undefiend';
    return (
      <motion.div className='flex flex-col flex-nowrap h-full justify-around' key='social-links'>
        <span className='text-center text-sm'>Created by: Plutoy#5022</span>
        <p className='flex justify-center gap-2 text-sm'>
          <span>Version: {version}</span>
          <span className='hidden md:inline'>
            Branch: <a href={`https://github.com/PlutoyDev/sky-shards/tree/${branchName}`}>{branchName}</a> (
            <a href={`https://github.com/PlutoyDev/sky-shards/commit/${commitSha}`}>{commitSha}</a>)
          </span>
        </p>
        <div className='mx-auto flex flex-row flex-wrap gap-1 justify-center items-center max-w-fit mt-1'>
          <button
            className=' bg-black text-white px-2 pt-0.5 pb-1 rounded-xl'
            onClick={e => (e.preventDefault(), window.open('https://github.com/PlutoyDev/sky-shards', '_blank'))}
          >
            <BsGithub className='text-md inline-block mr-2' />
            <span className='text-sm font-bold '>Source on GitHub</span>
          </button>
          <button
            className='bg-purple-700 text-white px-2 pt-0.5 pb-1 rounded-xl'
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
            <TbForms className='text-md inline-block mr-2' />
            <span className='text-sm font-bold '>Submit Feedback</span>
          </button>
          <button
            className='bg-yellow-400 text-black rounded-xl'
            onClick={e => (e.preventDefault(), window.open('https://www.buymeacoffee.com/plutoy', '_blank'))}
          >
            <img className='inline m-0 p-0 h-7 w-28 rounded-xl' src='/ext/buymeacoffee.png' />
          </button>
        </div>
      </motion.div>
    );
  },
];

const durationPerSection = 5; // seconds
const durationCycle = durationPerSection * subfooters.length;

if (durationCycle > 300) {
  //5 minutes
  throw new Error('Footer cycle duration is too long');
}

export default function Footer() {
  const [displaySection, setDisplaySection] = useState(0);
  const footerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // if mouse is not hovering over footer, change section
      if (!footerEl.current?.matches(':hover')) {
        setDisplaySection(sec => (sec + 1) % subfooters.length);
      } else {
        console.log('mouse is hovering over footer');
      }
    }, durationPerSection * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer ref={footerEl} className='footer glass container mx-auto'>
      <AnimatePresence initial={false} mode='wait'>
        {subfooters[displaySection]()}
      </AnimatePresence>
    </footer>
  );
}
