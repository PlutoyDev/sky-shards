import { useMemo } from 'react';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import { ShardInfo, getShardInfo } from '../../shardPredictor';

const monthName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface ShardCalendarProps {
  year: number;
  month: number;
  onDayClick?: (date: DateTime) => void;
}

export function ShardCalendar({ year, month, onDayClick }: ShardCalendarProps) {
  const { infos, calStart, calNumDays } = useMemo(() => {
    const start = DateTime.local(year, month, 1, { zone: 'America/Los_Angeles' });
    const end = start.endOf('month');
    const numDays = end.diff(start, 'days').days + 1;
    const infos = Array.from({ length: numDays }, (_, i) => {
      const date = start.plus({ days: i });
      return getShardInfo(date);
    });
    const calStart = start.startOf('week');
    const calEnd = end.endOf('week');
    const calNumDays = calEnd.diff(calStart, 'days').days + 1;
    return { infos, calStart, calNumDays };
  }, [year, month]);

  return (
    <div id='shardCalendar' className='glass'>
      <div className='title'>
        <h1>
          Shard Calendar for {monthName[month - 1]} {year}
        </h1>
      </div>
      <div className='calendarGrid' data-num-row={Math.floor(calNumDays / 7) + 1}>
        {Array.from({ length: calNumDays + 7 }, (_, key) => {
          if (key < 7) {
            return <DayCell key={key} weekday={key} />;
          }
          const date = calStart.plus({ days: key - 7 });
          if (date.month !== month) {
            return <DayCell key={key} date={date} />;
          } else {
            return <DayCell key={key} date={date} info={infos[date.day - 1]} onClick={() => onDayClick?.(date)} />;
          }
        })}
      </div>
    </div>
  );
}

interface DayCellProps {
  info?: ShardInfo;
  date?: DateTime;
  weekday?: number;
  onClick?: () => void;
}

const weekdayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DayCell({ info, date, weekday, onClick }: DayCellProps) {
  if (weekday !== undefined) {
    return (
      <div className='day-cell weekday' onClick={onClick}>
        <div className='day-number'>{weekdayName[weekday]}</div>
      </div>
    );
  } else if (!info && date) {
    return (
      <div className='day-cell padding' onClick={onClick}>
        <div className='day-number'>{date.day}</div>
      </div>
    );
  } else if (info) {
    const { haveShard, isRed, map, date, offset } = info;
    const classNames = [
      'day-cell',
      haveShard ? (isRed ? 'red' : 'black') : '',
      date.hasSame(DateTime.local({ zone: 'America/Los_Angeles' }), 'day') ? 'today' : '',
    ];

    return (
      <div className={classNames.join(' ')} onClick={onClick}>
        <div className='day-number'>{info.date.day}</div>
        {haveShard && (
          <>
            <div className='day-map'>{map}</div>
            <div className='day-clock'>
              <Clock date={date.plus(offset)} hideSeconds />
            </div>
          </>
        )}
      </div>
    );
  } else {
    console.log({ info, date, weekday });
    throw `No value given`;
  }
}
