import { CSSProperties, useMemo } from 'react';
import { DateTime, Duration } from 'luxon';
import { useSettings } from '../context/Settings';

interface ClockProp {
  time?: DateTime;
  duration?: Duration;
  hideSeconds?: boolean;
  convertTo?: 'local' | 'sky';
  className?: string;
  relFontSize?: number;
  disableMonoFont?: boolean;
}

export function Clock({
  time,
  duration,
  hideSeconds,
  convertTo,
  className = '',
  relFontSize = 1,
  disableMonoFont,
}: ClockProp) {
  const { twelveHourModeSetting } = useSettings();
  if (!duration && !time) throw new Error('Time component requires either time or duration prop');

  const formattedTime = duration
    ? duration.toFormat(
        hideSeconds ? (Math.abs(duration.as('minutes')) > 90 ? `hh'h' mm'm'` : `mm'm' ss's'`) : `hh'h' mm'm' ss's'`,
      )
    : time?.setZone(convertTo === 'local' ? 'local' : 'America/Los_Angeles')?.toLocaleString({
        hourCycle: twelveHourModeSetting === 'system' ? undefined : twelveHourModeSetting === 'true' ? 'h23' : 'h12',
        hour: '2-digit',
        minute: '2-digit',
        second: hideSeconds ? undefined : '2-digit',
      });

  className += disableMonoFont ? '' : ' font-mono';
  return (
    <span className={className} style={relFontSize ? { fontSize: `${relFontSize}em` } : undefined}>
      {formattedTime}
    </span>
  );
}

export default Clock;

interface CountdownProp {
  duration: Duration;
}

export function Countdown({ duration }: CountdownProp) {
  duration = duration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds');
  const isNegative = duration.as('seconds') < 0;
  if (isNegative) duration = duration.negate();
  const { hours, minutes, seconds } = duration;

  const days = hours > 60 ? Math.floor(hours / 24) : undefined;

  return (
    <div
      className={`grid auto-cols-max grid-flow-col grid-rows-2 justify-center justify-items-center ${
        days ? 'grid-cols-4' : 'grid-cols-3'
      }`}
    >
      {days && (
        <>
          <p className='text-start align-top font-mono text-[1.2em] font-bold leading-[1em] lg:text-[1.8em]'>{days}</p>
          <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Ds</p>
          <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Days</p>
        </>
      )}
      <CountdownParts value={days ? hours % 24 : hours} />
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Hrs</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Hours</p>
      <CountdownParts value={minutes} />
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Mins</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Minutes</p>

      <CountdownParts value={seconds} />
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Secs</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Seconds</p>
    </div>
  );
}

function CountdownParts({ value }: { value: number }) {
  const tensNumbers = useMemo(() => Array.from({ length: 6 }, (_, i) => <p key={i}>{i}</p>), []);
  const onesNumbers = useMemo(() => Array.from({ length: 60 }, (_, i) => <p key={i}>{i % 10}</p>), []);

  return (
    <div>
      {/* Tens */}
      <div className='inline-block h-[1em] overflow-hidden text-center align-bottom font-mono text-[1.2em] font-bold leading-none lg:text-[1.8em]'>
        <div
          className='relative h-[600%] origin-bottom transform transition-transform duration-700 ease-in-out [&>p]:h-[1em]'
          style={{ transform: `translateY(calc(${Math.floor(value / 10)} * -16.6667%)` }}
        >
          {tensNumbers}
        </div>
      </div>
      {/* Ones */}
      <div className='inline-block h-[1em] overflow-hidden text-center align-bottom font-mono text-[1.2em] font-bold leading-none lg:text-[1.8em]'>
        <div
          className='relative h-[6000%] origin-bottom transform transition-transform duration-700 ease-in-out [&>p]:h-[1em]'
          style={{ transform: `translateY(calc(${value} * -1.66667%)` }}
        >
          {onesNumbers}
        </div>
      </div>
    </div>
  );
}
