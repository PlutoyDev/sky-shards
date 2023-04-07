import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useHeaderFx } from '../../context/HeaderFx';
import { useSettings } from '../../context/Settings';

interface HeaderProp {
  setTwelveHourModeSetting: (value: string) => void;
  setLightMode: (value: string) => void;
  twelveHourModeSetting: string;
  lightMode: string;
}

export default function Header({
  setTwelveHourModeSetting,
  setLightMode,
  twelveHourModeSetting,
  lightMode,
}: HeaderProp) {
  const { isLightMode } = useSettings();
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  const { navigateDay } = useHeaderFx();

  const navigateToday = () => navigateDay(DateTime.local({ zone: 'America/Los_Angeles' }));

  return (
    <header id='header' className='glass'>
      <a id='title' href='/' onClick={e => (navigateToday(), e.preventDefault())}>
        <span>Sky Shards</span>
      </a>

      <time dateTime={DateTime.utc().toISO()} id='header-dateTime' onClick={navigateToday}>
        <Date hideYear short />
        <Clock sky hideSeconds />
      </time>

      <div id='header-buttons'>
        <button
          className='rounded-lg shadow-xl shadow-zinc-700 w-min p-1.5 bg-opacity-25 bg-slate-50 hover:bg-opacity-50'
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <FaCog size={18} />
        </button>
        {/* Popover Bottom Left */}
        <div
          className={`absolute z-10 w-60 rounded-lg shadow-xl shadow-zinc-700
          ${isPopoverOpen ? 'block' : 'hidden'} glass text-white text-border`}
          style={{ top: '4rem', right: '1.8rem' }}
        >
          <div className='flex flex-col gap-2 p-2 min-h-50 '>
            <h3 className='text-lg font-bold text-center'>Settings</h3>
            <div className='border-zinc-300 border-opacity-50 border-t-2 pt-1'>
              <p className='text-md'>Theme</p>
              <div className='flex flex-row items-center rounded-full m-1.5'>
                {[
                  ['Light', 'true', 'rounded-l-full'],
                  ['System', 'system', 'border-x-2 border-zinc-300 border-opacity-50'],
                  ['Dark', 'false', 'rounded-r-full'],
                ].map(([label, value, addClass]) => (
                  <button
                    key={value}
                    className={`flex-1  text-xs p-1 whitespace-nowrap 
                    ${lightMode === value ? 'bg-opacity-20' : ''} 
                    ${isLightMode ? 'bg-sky-300 text-black' : 'bg-violet-600 text-white'} 
                    ${addClass}`}
                    onClick={() => setLightMode(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className='border-zinc-300 border-opacity-50 border-t-2 pt-1'>
              <p className='text-md'>Time Format</p>
              <div className='flex flex-row items-center rounded-full m-1.5'>
                {[
                  ['12 Hour', 'true', 'rounded-l-full'],
                  ['System', 'system', 'border-x-2 border-zinc-300 border-opacity-50'],
                  ['24 Hour', 'false', 'rounded-r-full'],
                ].map(([label, value, addClass]) => (
                  <button
                    key={value}
                    className={`flex-1  text-xs p-1 whitespace-nowrap 
                      ${twelveHourModeSetting === value ? ' bg-opacity-20' : ''} 
                      ${isLightMode ? 'bg-sky-300 text-black' : 'bg-violet-600 text-white'}
                      ${addClass}`}
                    onClick={() => setTwelveHourModeSetting(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
