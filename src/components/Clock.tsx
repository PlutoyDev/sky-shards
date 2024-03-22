import { useTranslation } from 'react-i18next';
import { DateTime, Duration, Settings as LuxonSettings } from 'luxon';
import { useNow } from '../context/Now';
import { useSettings } from '../context/Settings';

interface ClockProp {
  time?: DateTime;
  duration?: Duration;
  dualUnit?: boolean;
  convertTo?: 'local' | 'sky';
  className?: string;
  relFontSize?: number;
  disableMonoFont?: boolean;
  disableSeconds?: boolean;
}

export function StaticClock({
  time,
  duration,
  dualUnit,
  convertTo,
  className = '',
  relFontSize = 1,
  disableMonoFont,
  disableSeconds,
}: ClockProp) {
  const { t } = useTranslation('durationFmts');
  const { twelveHourMode } = useSettings();
  if (!duration && !time) throw new Error('Time component requires either time or duration prop');
  if (time && duration) throw new Error('Time component requires either time or duration prop, not both');
  if (time && time.locale !== LuxonSettings.defaultLocale) {
    time = time.setLocale(LuxonSettings.defaultLocale);
  }

  //disableSeconds || dualUnit ? (Math.abs(duration.as('minutes')) > 90 ? 'hm' : disableSeconds ? 'm' : 'ms'  ) : 'hms'
  const formattedTime = duration
    ? duration.toFormat(
        t(
          disableSeconds || dualUnit
            ? Math.abs(duration.as('minutes')) > 90
              ? 'hm'
              : disableSeconds
                ? 'm'
                : 'ms'
            : 'hms',
        ),
      )
    : time?.setZone(convertTo === 'local' ? 'default' : 'America/Los_Angeles')?.toLocaleString({
        hourCycle: twelveHourMode === 'system' ? undefined : twelveHourMode === 'true' ? 'h12' : 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: disableSeconds || dualUnit ? undefined : '2-digit',
      });

  className += disableMonoFont ? '' : ' font-mono';
  return (
    <span className={className} style={relFontSize ? { fontSize: `${relFontSize}em` } : undefined}>
      {formattedTime}
    </span>
  );
}

export default StaticClock;

type ClockNowProp = Omit<ClockProp, 'convertTo' | 'duration'> & {
  showLocal?: boolean;
  invertDiff?: boolean;
};

export function ClockNow({ time, showLocal = false, invertDiff, ...clockParam }: ClockNowProp) {
  const { application, local } = useNow();
  if (time) {
    const duration = invertDiff ? application.diff(time) : time.diff(application);
    return <StaticClock {...clockParam} duration={duration} />;
  } else {
    const now = showLocal ? local : application;
    return <StaticClock {...clockParam} time={now} />;
  }
}

interface CountdownProp {
  to: DateTime;
}

export function Countdown({ to }: CountdownProp) {
  const { application: now } = useNow();
  const { t } = useTranslation('durationUnits');
  let duration = now.diff(to).shiftTo('hours', 'minutes', 'seconds', 'milliseconds');
  const isNegative = duration.as('seconds') < 0;
  if (isNegative) duration = duration.negate();
  const { hours, minutes, seconds } = duration;

  const days = hours > 60 ? Math.floor(hours / 24) : undefined;

  return (
    <div className='my-0.5 grid auto-cols-fr grid-flow-col grid-rows-[auto,auto] justify-center justify-items-center gap-x-2 px-2'>
      {days && (
        <CountdownParts
          value={days}
          unitShort={t('days.short', { count: days })}
          unitLong={t('days.long', { count: days })}
        />
      )}
      <CountdownParts
        value={days ? hours % 24 : hours}
        unitShort={t('hours.short', { count: hours })}
        unitLong={t('hours.long', { count: hours })}
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
      <span className='font-mono text-[1.2em] font-bold leading-[.8em] md:text-[1.8em] md:leading-[1em]'>
        {valueStr}
      </span>
      <span className='text-[0.8em] opacity-60 md:hidden'>{unitShort}</span>
      <span className=' text-[1em] opacity-60 max-md:hidden'>{unitLong}</span>
    </>
  );
}
