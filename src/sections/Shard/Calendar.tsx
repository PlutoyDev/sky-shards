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
}

export function ShardCalendar({ year, month }: ShardCalendarProps) {
  return (
    <div id='shardCalendar' className='glass'>
      <div className='title'>
        <h1>
          Shard Calendar for {monthName[month - 1]} {year}
        </h1>
      </div>
    </div>
  );
}
