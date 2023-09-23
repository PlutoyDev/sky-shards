// Progress bar with marker to show progress of the shard, the progress bar indicates the time of day.
// The progress bar is divided up
// If shard is active the progress bar is the color of the shard
// If shard is inactive the progress bar is white
// show past in grey
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StaticClock } from '../../components/Clock';
import { useNow } from '../../context/Now';
import { ShardInfo } from '../../shardPredictor';

interface ShardProgressProps {
  info: ShardInfo;
}

export function ShardProgress({ info }: ShardProgressProps) {
  const { application: now } = useNow();
  const { t } = useTranslation('progressSection');
  const [useLocalTz, setUseLocalTz] = useState(true); //Use local time or sky time

  const startOfDay = info.date.startOf('day');
  const endOfDay = info.date.endOf('day');
  const isToday = info.date.hasSame(now, 'day');

  const staticElements = useMemo(
    () => (
      <>
        {/* Background */}
        <div className='absolute left-0 top-0 z-0 h-full rounded-full bg-gray-200' style={{ width: '100%' }} />
        {/* Start label */}
        <span className='absolute -left-[0.5em] top-0'>
          <StaticClock time={startOfDay} hideSeconds convertTo={useLocalTz ? 'local' : undefined} />
        </span>
        {/* End label */}
        {/* <span className='absolute -right-[0.5em] max-sm:hidden sm:bottom-0'>
          <StaticClock time={endOfDay} hideSeconds convertTo={useLocalTz ? 'local' : undefined} />
        </span> */}
        {/* Segments */}
        {info.occurrences.map(({ start, end }, i) => {
          const startPercent = start.diff(startOfDay).as('seconds') / 86400;
          const endPercent = end.diff(startOfDay).as('seconds') / 86400;
          return (
            <div
              key={i}
              className={'absolute left-0 top-0 z-10 h-full rounded-full ' + (info.isRed ? 'bg-red-600' : 'bg-black')}
              style={{ width: `${(endPercent - startPercent) * 100}%`, left: `${startPercent * 100}%` }}
            >
              {/* Time Label */}
              <span
                className={
                  'absolute -left-[0.5em] whitespace-nowrap' + (i === 1 ? ' max-sm:top-0 sm:bottom-0' : ' bottom-0')
                }
              >
                <StaticClock time={start} hideSeconds convertTo={useLocalTz ? 'local' : undefined} />
              </span>
              <span className='absolute -right-[0.5em] top-0 max-sm:hidden'>
                <StaticClock time={end} hideSeconds convertTo={useLocalTz ? 'local' : undefined} />
              </span>
            </div>
          );
        })}
      </>
    ),
    [info.offset, info.isRed, useLocalTz],
  );

  return useMemo(
    () => (
      <div className='glass mx-auto flex w-full max-w-lg flex-col items-center justify-center lg:max-w-4xl '>
        <div>
          <Trans
            t={t}
            i18nKey={`showTimeIn.${useLocalTz ? 'localTime' : 'skyTime'}`}
            components={{
              a: (
                <a
                  className='text-bold cursor-pointer underline decoration-dashed'
                  onClick={e => (e.preventDefault(), setUseLocalTz(!useLocalTz))}
                />
              ),
            }}
          />
        </div>
        <div className='relative top-[1.5em] min-h-[3em] w-full'>
          <div className='relative -left-1 mx-1 h-1 w-full rounded-full'>
            {staticElements}
            {/* Past */}
            {startOfDay < now && (
              <div
                className='absolute left-0 top-0 z-20 h-full rounded-full bg-gray-400 bg-opacity-80'
                style={{
                  width: isToday ? `${(now.diff(startOfDay).as('seconds') / 86400) * 100}%` : '100%',
                }}
              >
                {/* Now */}
                {isToday && (
                  <div className='relative left-[0.5em] top-[-0.4em] float-right h-[1em] w-[1em] transform rounded-[1em] bg-primary' />
                )}
              </div>
            )}
          </div>
        </div>
        <p className='text-[8px] sm:hidden'>{t('startTimeOnly')}</p>
      </div>
    ),
    [t, now.year, now.month, now.day, now.hour, Math.floor(now.minute / 10), info.offset, info.isRed, useLocalTz],
  );
}

export default ShardProgress;
