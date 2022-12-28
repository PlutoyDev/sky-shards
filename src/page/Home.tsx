import { useLoaderData, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import ShardLandEndCountdown from '../sections/Shard/Countdown';
import ShardInfoDisplay from '../sections/Shard/Info';
import { nextOrCurrent } from '../shardPredictor';
import './Home.css';

interface HomeLoaderData {
  relDate?: number;
  absDate?: DateTime;
}

export default function Home() {
  const now = useNow().application;
  const { relDate, absDate } = (useLoaderData() ?? {}) as HomeLoaderData;
  const customDate = relDate ? now.plus({ days: relDate }) : absDate;
  const { info, index, phases } = nextOrCurrent(customDate ?? now);
  const futureOrToday = !customDate || customDate.hasSame(now, 'day') || customDate > now;

  const navigate = useNavigate();
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const newDate = DateTime.prototype.plus.call(customDate ?? now, { days: 1 });
      if (newDate.hasSame(now, 'day')) navigate('/');
      else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
    },
    onSwipedRight: () => {
      const newDate = DateTime.prototype.minus.call(customDate ?? now, { days: 1 });
      if (newDate.hasSame(now, 'day')) navigate('/');
      else navigate(`/date/${newDate.toFormat('yyyy/MM/dd')}`);
    },
    preventScrollOnSwipe: true,
  });

  const verbsTense =
    !customDate || customDate.hasSame(now, 'day')
      ? phases && now > phases?.land
        ? 'present'
        : 'future'
      : customDate < now
      ? 'past'
      : 'future';

  return (
    <div id='HomePage' {...handlers}>
      <ShardInfoDisplay info={info} now={now} verbsTense={verbsTense} />
      {futureOrToday && phases && <ShardLandEndCountdown phases={phases} index={index} now={now} />}
    </div>
  );
}
