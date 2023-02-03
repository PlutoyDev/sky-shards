import { useLoaderData, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import ShardInfoDisplay from '../sections/Shard/Info';
import ShardTimingDisplay from '../sections/Shard/Timing';
import { nextOrCurrent } from '../shardPredictor';
import './Shard.css';

interface HomeLoaderData {
  relDate?: number;
  absDate?: DateTime;
}

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

export default function Home() {
  const now = useNow().application;
  const { relDate, absDate } = (useLoaderData() ?? {}) as HomeLoaderData;
  const customDate = relDate ? now.plus({ days: relDate }) : absDate;
  const { info, index, phases } = nextOrCurrent(customDate ?? now);
  const futureOrToday = !customDate || customDate.hasSame(now, 'day') || customDate > now;

  const verbsTense =
    !customDate || customDate.hasSame(now, 'day')
      ? phases
        ? now > phases?.land
          ? 'present'
          : 'future'
        : 'past'
      : customDate < now
      ? 'past'
      : 'future';

  const nextDay = () => {
    const newDate = DateTime.prototype.plus.call(customDate ?? now, { days: 1 });
    if (newDate.hasSame(now, 'day')) navigate('/');
    else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
  };

  const prevDay = () => {
    const newDate = DateTime.prototype.minus.call(customDate ?? now, { days: 1 });
    if (newDate.hasSame(now, 'day')) navigate('/');
    else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
  };

  const navigate = useNavigate();
  const handlers = useSwipeable({
    onSwipedLeft: nextDay,
    onSwipedRight: prevDay,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 100,
  });

  return (
    <main className='Page HomePage' {...handlers}>
      <div id='topNavHint' className='navHint disabled'>
        <span className='navHintText'>Swipe down for images of where shard will land</span>
        {SvgArrow}
      </div>
      <div id='leftNavHint' className='navHint' onClick={prevDay}>
        <span className='navHintText'>Swipe right or Click here to see the previous day</span>
        {SvgArrow}
      </div>
      <ShardInfoDisplay info={info} verbsTense={verbsTense} />
      {phases && futureOrToday && <ShardTimingDisplay phases={phases} index={index} now={now} />}
      <div id='rightNavHint' className='navHint' onClick={nextDay}>
        <span className='navHintText'>Swipe left or Click here to see the next day</span>
        {SvgArrow}
      </div>
      <div id='bottomNavHint' className='navHint disabled'>
        <span className='navHintText'>Swipe up for all timings</span>
        {SvgArrow}
      </div>
    </main>
  );
}
