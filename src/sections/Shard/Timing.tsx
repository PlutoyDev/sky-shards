import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { ShardPhases } from '../../shardPredictor';

interface ShardTimingDisplayProps {
  index?: number;
  phases: ShardPhases;
  now?: DateTime;
}

export default function ShardTimingDisplay({ index, phases, now }: ShardTimingDisplayProps) {
  const { land, end } = phases;
  const defNow = now ?? useNow().application;
  const ordinalIndex = index !== undefined && ['1st', '2nd', '3rd'][index];
  const started = defNow > land;
  const next = started ? end : land;

  return (
    <div id='shardTiming' className='glass'>
      <div id='shardCountdown'>
        <span>
          <span className='Emphasized'>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </span>
          {started && (
            <>
              <span>has </span>
              <span className='Emphasized'>landed</span>
              <span>, it </span>
            </>
          )}
          <span>will </span>
          <span className='Emphasized'>{started ? 'end' : 'land'} </span>
          <span>in </span>
        </span>
        <Clock date={next} relative trim />
        <span> which is </span>
      </div>
      <div id='shardAbsLocal'>
        <span className='Emphasized'>Your Time: </span>
        <div className='Demphasized'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</div>
        <Date date={next} local />
        <Clock date={next} local />
      </div>
      <div id='shardAbsSky'>
        <span className='Emphasized'>Sky Time: </span>
        <div className='Demphasized'>(America/Los_Angeles)</div>
        <Date date={next} />
        <Clock date={next} />
      </div>
    </div>
  );
}
