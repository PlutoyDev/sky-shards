import { useLoaderData } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import ShardLandEndCountdown from '../sections/Shard/Countdown';
import ShardInfoDisplay from '../sections/Shard/Info';
import { nextOrCurrent } from '../shardPredictor';

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

  const verbsTense =
    !customDate || customDate.hasSame(now, 'day')
      ? phases && now > phases?.land
        ? 'present'
        : 'future'
      : customDate < now
      ? 'past'
      : 'future';

  return (
    <div id='HomePage'>
      <ShardInfoDisplay info={info} now={now} verbsTense={verbsTense} />
      {futureOrToday && phases && <ShardLandEndCountdown phases={phases} index={index} now={now} />}
    </div>
  );
}
