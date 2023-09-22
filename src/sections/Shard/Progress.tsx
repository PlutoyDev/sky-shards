// Progress bar with marker to show progress of the shard, the progress bar indicates the time of day.
// The progress bar is divided up
// If shard is active the progress bar is the color of the shard
// If shard is inactive the progress bar is white
// show past in grey
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { StaticClock } from '../../components/Clock';
import { useNow } from '../../context/Now';
import { ShardInfo } from '../../shardPredictor';

interface ShardProgressProps {
  date: DateTime;
  info: ShardInfo;
}

export function ShardProgress({ date, info }: ShardProgressProps) {
  const { application: now } = useNow();
  const [local, setLocal] = useState(true); //Use local time or sky time

  const startOfDay = date.startOf('day');
  const endOfDay = date.endOf('day');
  const isToday = date.hasSame(now, 'day');

  return (
    <div className='glass mx-auto flex w-full max-w-lg flex-col items-center justify-center lg:max-w-4xl '>
      <div>
        <span className='text-bold justify-self-end'>Show time in </span>
        <a
          className='text-bold cursor-pointer underline decoration-dashed'
          onClick={e => (e.preventDefault(), setLocal(!local))}
        >
          {local ? 'Sky Time' : 'Local Time'}
        </a>
      </div>
      <div className='relative top-[1.5em] min-h-[3em] w-full'>
        <div className='relative -left-1 mx-1 h-1 w-full rounded-full'>
          {/* Background */}
          <div className='absolute left-0 top-0 z-0 h-full rounded-full bg-gray-200' style={{ width: '100%' }} />
          {/* Start label */}
          <span className='absolute -left-[0.5em] top-0'>
            <StaticClock time={startOfDay} hideSeconds convertTo={local ? 'local' : undefined} />
          </span>
          {/* End label */}
          <span className='absolute -right-[0.5em] max-sm:top-0 sm:bottom-[0.25em]'>
            <StaticClock time={endOfDay} hideSeconds convertTo={local ? 'local' : undefined} />
          </span>
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
                <span className='absolute -left-[1.5em] bottom-[0.25em]  whitespace-nowrap'>
                  <StaticClock time={start} hideSeconds convertTo={local ? 'local' : undefined} />
                </span>
                <span className='absolute -right-[2em] top-[0.25em] whitespace-nowrap max-sm:hidden'>
                  <StaticClock time={end} hideSeconds convertTo={local ? 'local' : undefined} />
                </span>
              </div>
            );
          })}
          {/* Past */}
          {startOfDay < now && (
            <div
              className='absolute left-0 top-0 z-20 h-full rounded-full bg-gray-400 opacity-90'
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
      <p className='text-[8px] sm:hidden'>Limited width: Start time only</p>
    </div>
  );
}

export default ShardProgress;
