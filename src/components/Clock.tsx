import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime, Duration, Settings as LuxonSettings } from 'luxon';
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
  const { t } = useTranslation('durationFmts');
  const { twelveHourModeSetting } = useSettings();
  if (!duration && !time) throw new Error('Time component requires either time or duration prop');
  if (time && duration) throw new Error('Time component requires either time or duration prop, not both');
  if (time && time.locale !== LuxonSettings.defaultLocale) {
    time = time.setLocale(LuxonSettings.defaultLocale);
  }

  const formattedTime = duration
    ? duration.toFormat(t(hideSeconds ? (Math.abs(duration.as('minutes')) > 90 ? 'hm' : 'ms') : 'hms'))
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
  const { t } = useTranslation('durationUnits');
  duration = duration.shiftTo('hours', 'minutes', 'seconds', 'milliseconds');
  const isNegative = duration.as('seconds') < 0;
  if (isNegative) duration = duration.negate();
  const { hours, minutes, seconds } = duration;

  const days = hours > 60 ? Math.floor(hours / 24) : undefined;

  return (
    <div className='grid auto-cols-fr grid-flow-col grid-rows-2 justify-center justify-items-center'>
      {days && (
        <CountdownParts
          value={days}
          unitShort={t('days.short', { count: days })}
          unitLong={t('days.long', { count: days })}
        />
      )}
      <CountdownParts
        value={days ? hours % 24 : hours}
        unitShort={t('hours.long', { count: hours })}
        unitLong={t('hours.short', { count: hours })}
      />
      <CountdownParts
        value={minutes}
        unitShort={t('minutes.short', { count: minutes })}
        unitLong={t('minutes.long', { count: minutes })}
      />
      <CountdownParts
        value={seconds}
        unitShort={t('seconds.short', { count: seconds })}
        unitLong={t('seconds.long', { count: seconds })}
      />
    </div>
  );
}

export function CountdownParts({
  value,
  unitShort,
  unitLong,
}: {
  value: number;
  unitShort?: string;
  unitLong?: string;
}) {
  const valueStr = value.toString().padStart(2, '0');
  return (
    <>
      <p className='text-start align-top font-mono text-[1.2em] font-bold leading-[1em] lg:text-[1.8em]'>{valueStr}</p>
      <p className='font-mono text-[0.8em] opacity-60 md:hidden lg:text-[1em]'>{unitShort}</p>
      <p className='hidden font-mono text-[0.8em] opacity-60 md:block lg:text-[1em]'>{unitLong}</p>
    </>
  );
}
