import { CSSProperties } from 'react';
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
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: hideSeconds ? undefined : '2-digit',
        hour12: twelveHourModeSetting === 'system' ? undefined : twelveHourModeSetting === 'true',
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

  const days = hours > 99 ? Math.floor(hours / 24) : undefined;

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
      <p className='countdown font-mono text-[1.2em] font-bold lg:text-[1.8em]'>
        <span style={{ '--value': days ? hours % 24 : hours } as CSSProperties} />
      </p>
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Hrs</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Hours</p>
      <p className='countdown font-mono text-[1.2em] font-bold lg:text-[1.8em]'>
        <span style={{ '--value': minutes } as CSSProperties} />
      </p>
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Mins</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Minutes</p>
      <p className='countdown font-mono text-[1.2em] font-bold lg:text-[1.8em]'>
        <span style={{ '--value': seconds } as CSSProperties} />
      </p>
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>Secs</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>Seconds</p>
    </div>
  );
}
