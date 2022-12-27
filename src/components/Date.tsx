import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import useSizing from '../hooks/useSizing';
import './Date.css';

interface DateProp {
  date?: DateTime;
  local?: boolean;
  short?: boolean;
  hideWeekday?: boolean;
  hideYear?: boolean;
}

export default function Date({ date, local, short, hideWeekday, hideYear }: DateProp) {
  const {
    devices: { isMobile },
  } = useSizing();
  const now = local ? useNow().local : useNow().application;
  date = (local ? date?.toLocal() : date?.setZone('America/Los_Angeles')) ?? now;
  const defShort = short ?? isMobile;
  const format = [
    hideWeekday ? '' : defShort ? 'ccc,' : 'cccc,',
    defShort ? 'dd' : 'd',
    defShort ? 'MMM' : 'MMMM',
    hideYear ? '' : defShort ? 'yy' : ', yyyy',
  ].join(' ');
  return <span className='Date'>{date.toFormat(format)}</span>;
}
