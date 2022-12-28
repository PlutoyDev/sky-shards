import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { ShardPhases } from '../../shardPredictor';
import './index.css';

interface ShardLandEndCountdownProps {
  index?: number;
  phases: ShardPhases;
  now?: DateTime;
}

export default function ShardLandEndCountdown({ index, phases, now }: ShardLandEndCountdownProps) {
  const { land, end } = phases;
  const defNow = now ?? useNow().application;
  const ordinalIndex = index !== undefined && ['1st', '2nd', '3rd'][index];
  const started = defNow > land;
  const next = started ? end : land;

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
      <Clock date={next} relative trim />
      <span> which is </span>
      <div className='AbsTimeGrp'>
        <div className='AbsTime'>
          <span className='smaller'>Your Time: </span>
          <span className='smaller'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          <Date date={next} local hideYear />
          <Clock date={next} local />
        </div>
        <div className='AbsTime'>
          <span className='smaller'>Sky Time: </span>
          <span className='smaller'>(America/Los_Angeles)</span>
          <Date date={next} hideYear />
          <Clock date={next} />
        </div>
      </div>
    </div>
  );
}
