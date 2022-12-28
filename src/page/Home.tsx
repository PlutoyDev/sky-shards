import { useNow } from '../context/Now';
import ShardLandEndCountdown from '../sections/Shard/Countdown';
import ShardInfoDisplay from '../sections/Shard/Info';
import { nextOrCurrent } from '../shardPredictor';

export default function Home() {
  const now = useNow().application;
  const { info, index, phases } = nextOrCurrent(now);
  return (
    <div id='HomePage'>
      <ShardInfoDisplay info={info} now={now} verbsTense={'future'} />
      {phases && <ShardLandEndCountdown phases={phases} index={index} now={now} />}
    </div>
  );
}
