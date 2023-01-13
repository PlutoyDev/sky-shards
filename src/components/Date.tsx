import { memo } from 'react';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import { useSettings } from '../context/Settings';
import './Date.css';

interface DateProp {
  date?: DateTime;
  local?: boolean;
  short?: boolean;
  describeClose?: boolean;
  hideWeekday?: boolean;
  hideYear?: boolean;
}

export default function Date({ date, local, short, describeClose, hideWeekday, hideYear }: DateProp) {
  const isMobile = useSettings().isCompactMode;
  const now = local ? useNow().local : useNow().application;
  date = (local ? date?.toLocal() : date?.setZone('America/Los_Angeles')) ?? now;
  const howClose = Math.ceil(date.diff(now, 'days').days);
  if (describeClose && howClose <= 1) {
    return (
      <span className='Date'>
        {
          {
            '-1': ', Yesterday',
            '0': ', Today',
            '1': ', Tomorrow',
          }[howClose.toString()]
        }
      </span>
    );
  }
  const defShort = short ?? isMobile;
  const format = [
    hideWeekday ? '' : defShort ? 'ccc,' : 'cccc,',
    defShort ? ' dd' : ' d',
    defShort ? ' MMM' : ' MMMM',
    hideYear ? '' : defShort ? ' yy' : ', yyyy',
  ].join('');
  return (
    <>
      {describeClose && <span>, on </span>}
      <span className='Date'>{date.toFormat(format)}</span>
    </>
  );
}
