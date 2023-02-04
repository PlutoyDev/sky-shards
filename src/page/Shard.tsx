import { useMemo } from 'react';
import { LoaderFunction, redirect, useLoaderData } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import ShardSummary from '../sections/Shard/Summary';
import ShardTimeline from '../sections/Shard/Timeline';
import './Shard.css';

const relDateMap = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  tmr: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
};

interface ShardLoaderData {
  isShardPage: true;
  date: DateTime;
}

export const ShardPageLoader: LoaderFunction = ({ params }): Response | ShardLoaderData => {
  const [route, ...args] = params['*']?.split('/') ?? [];

  if (route === 'date') {
    const [yearStr, monthStr, dayStr] = args;
    const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
    const month = monthStr ? parseInt(monthStr, 10) : 1;
    const day = dayStr ? parseInt(dayStr, 10) : 1;

    if (year && month && day) {
      const date = DateTime.local(year, month, day, {
        zone: 'America/Los_Angeles',
      });

      if (date.isValid) {
        //Redirect back to home page if date is today
        if (DateTime.local({ zone: 'America/Los_Angeles' }).hasSame(date, 'day')) {
          return redirect(`/`);
        }

        //Minimum date is 2022-10-01
        if (date < DateTime.local(2022, 10, 1, { zone: 'America/Los_Angeles' })) {
          return redirect(`/date/2022/10/01`);
        }

        return {
          isShardPage: true,
          date,
        };
      }
    }
  } else if (Object.keys(relDateMap).includes(route)) {
    return redirect(
      `/date/${DateTime.local()
        .plus({ days: relDateMap[route as keyof typeof relDateMap] })
        .toFormat('yyyy/MM/dd')}`,
    );
  } else if (route === 'next') {
    // const today = DateTime.local().setZone('America/Los_Angeles');
    // if (args[0] === 'red')
    //   return redirect(`/date/${nextShardInfo(today, { colorIsRed: true }).date.toFormat('yyyy/MM/dd')}`);
    // if (args[0] === 'black')
    //   return redirect(`/date/${nextShardInfo(today, { colorIsRed: false }).date.toFormat('yyyy/MM/dd')}`);
    // return redirect(`/date/${nextShardInfo(today).date.toFormat('yyyy/MM/dd')}`);
  }
  return redirect('/');
};

//16 by 16 arrow down
const SvgArrow = (
  <svg
    className='navHintArrow'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M8 12L12 8L8 4' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

export default function Shard() {
  const now = useNow().application;
  const { date } = (useLoaderData() ?? {}) as ShardLoaderData;
  const { info, index, phases } = nextOrCurrent(date ?? now);
  const futureOrToday = !date || date.hasSame(now, 'day') || date > now;

  const verbsTense =
    !date || date.hasSame(now, 'day')
      ? phases
        ? now > phases?.land
          ? 'present'
          : 'future'
        : 'past'
      : date < now
      ? 'past'
      : 'future';

  const nextDay = () => {
    const newDate = DateTime.prototype.plus.call(date ?? now, { days: 1 });
    if (newDate.hasSame(now, 'day')) navigate('/');
    else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
  };

  const prevDay = () => {
    const newDate = DateTime.prototype.minus.call(date ?? now, { days: 1 });
    if (newDate.hasSame(now, 'day')) navigate('/');
    else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
  };

  const navigate = useNavigate();
  const handlers = useSwipeable({
    onSwipedLeft: nextDay,
    onSwipedRight: prevDay,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <main className='Page ShardPage'>
      <div id='shardContent'>
        <ShardSummary date={activeDate} />
        <ShardTimeline date={activeDate} />
      </div>
      {/* <NavHint position='top' hint='Swipe down or Click here to see the top section' />
      <NavHint position='bottom' hint='Swipe up or Click here to see the bottom section' /> */}
      <NavHint position='left' hint='Swipe right or Click here to see the previous day' />
      <NavHint position='right' hint='Swipe left or Click here to see the next day' />
    </main>
  );
}

interface NavHintProps {
  hint: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  onClick?: () => void;
}

function NavHint({ hint, position, disabled, onClick }: NavHintProps) {
  return useMemo(
    () => (
      <div id={`${position}NavHint`} className={`navHint ${disabled ? 'disabled' : ''}`} onClick={onClick}>
        <span className='navHintText'>{hint}</span>
        {SvgArrow}
      </div>
    ),
    [hint, position, onClick],
  );
}
