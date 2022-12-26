import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import useSizing from '../hooks/useSizing';
import './Date.css';

interface DateProp {
  date?: DateTime;
}

export default function Date({ date }: DateProp) {
  const {
    devices: { isMobile },
  } = useSizing();
  date = date ?? useNow().application;
  const format = [
    isMobile ? 'ccc,' : 'cccc,',
    isMobile ? 'dd' : 'd',
    isMobile ? 'MMM' : 'MMMM',
    isMobile ? 'yy' : ', yyyy',
  ].join(' ');
  return <span className='Date'>{date.toFormat(format)}</span>;
}
