import { DateTime } from 'luxon';
import Clock from '../components/Clock';
import Date from '../components/Date';
import { useNow } from '../context/Now';
import { getShardInfo, nextOrCurrent, ShardInfo, ShardPhases } from '../shardPredictor';
import './Summary.css';

interface SummaryProps {
  now?: DateTime;
}

export default function Summary({ now }: SummaryProps) {
  const defNow = now ?? useNow().application;
  const { info, index, phases } = nextOrCurrent(defNow);

  return (
    <div id='SummaryPage'>
      <ShardInfoDisplay info={info} now={defNow} />
      {phases && <ShardLandEndCountdown phases={phases} index={index} now={defNow} />}
    </div>
  );
}

interface ShardInfoDisplayProps {
  info?: ShardInfo;
  now?: DateTime;
}

export function ShardInfoDisplay({ info, now }: ShardInfoDisplayProps) {
  const { date, haveShard, isRed, map, realmFull, realmNick } = info ?? getShardInfo(now ?? useNow().application);
  const color = isRed ? 'Red' : 'Black';

  if (!haveShard) {
    return (
      <div id='ShardInfoDisplay'>
        <span>There is </span>
        <span className='Emphasized'>No Shard </span>
        <span>on </span>
        <Date date={date} />
      </div>
    );
  } else {
    return (
      <div id='ShardInfoDisplay'>
        <span>
          <span>There will be </span>
          <span className={`${color} Emphasized`}>{color} Shard </span>
          <span> on </span>
        </span>

        <span>
          <Date date={date} />
          <span> in </span>
        </span>
        <span>
          <span>
            <span className='Emphasized'>{map}, </span>
          </span>
          <span>
            <span className='Emphasized Full'>{realmFull}</span>
            <span className='Emphasized Nick'>{realmNick}</span>
          </span>
        </span>
      </div>
    );
  }
}

interface ShardLandEndCountdownProps {
  index?: number;
  phases: ShardPhases;
  now?: DateTime;
}

export function ShardLandEndCountdown({ index, phases, now }: ShardLandEndCountdownProps) {
  const { land, end } = phases;
  const defNow = now ?? useNow().application;
  const ordinalIndex = index !== undefined && ['1st', '2nd', '3rd'][index];
  const started = defNow > land;

  return (
    <div id='ShardLandEndCountdown'>
      <span>
        <span className='Emphasized'>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </span>
        {started && (
          <>
            <span className='Emphasized'>has landed </span>
            <Clock date={land} relative trim />
            <span> ago, It </span>
          </>
        )}
        <span>will </span>
        <span className='Emphasized'>{started ? 'end' : 'land'} </span>
        <span>in </span>
      </span>
      <Clock date={started ? end : land} relative trim />
      <span> which is </span>
      <div className='AbsTimeGrp'>
        <div className='AbsTime'>
          <span className='smaller'>Your Time: </span>
          <span className='smaller'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          <Clock date={started ? end : land} />
        </div>
        <div className='AbsTime'>
          <span className='smaller'>Sky Time: </span>
          <span className='smaller'>(America/Los_Angeles)</span>
          <Clock date={started ? end : land} />
        </div>
      </div>
    </div>
  );
}
