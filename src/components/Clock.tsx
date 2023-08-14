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
        hideSeconds ? (Math.abs(duration.as('hours')) > 2 ? `hh'h' mm'm'` : `mm'm' ss's'`) : `hh'h' mm'm' ss's'`,
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
  const valueClassName = 'font-mono font-bold text-[1.2em] lg:text-[1.8em] countdown';
  const labelClassName = 'font-mono text-[0.6em] lg:text-[1em] opacity-60';

  const days = hours > 99 ? Math.floor(hours / 24) : undefined;

  return (
    <div
      className={`grid auto-cols-max grid-flow-col grid-rows-2 justify-center justify-items-center ${
        days ? 'grid-cols-4' : 'grid-cols-3'
      }`}
    >
      {days && (
        <>
          <p className={valueClassName}>
            <span style={{ '--value': days } as CSSProperties} />
          </p>
          <p className={labelClassName}>Days</p>
        </>
      )}
      <p className={valueClassName}>
        <span style={{ '--value': days ? hours % 24 : hours } as CSSProperties} />
      </p>
      <p className={labelClassName}>Hours</p>
      <p className={valueClassName}>
        <span style={{ '--value': minutes } as CSSProperties} />
      </p>
      <p className={labelClassName}>Minutes</p>
      <p className={valueClassName}>
        <span style={{ '--value': seconds } as CSSProperties} />
      </p>
      <p className={labelClassName}>Seconds</p>
    </div>
  );
}
