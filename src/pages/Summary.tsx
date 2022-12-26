import { ReactNode } from 'react';
import { DateTime } from 'luxon';
import Clock from '../components/Clock';
import Date from '../components/Date';
import { useNow } from '../context/Now';
import { nextOrCurrent, ShardPhases } from '../shardPredictor';
import './Summary.css';

interface SummaryProps {
  now?: DateTime;
}

const phaseNameForSubDisplay: Record<keyof ShardPhases, string> = {
  early: 'Early Shard Skies',
  eruption: 'Eden eruption',
  start: 'Gate Shard',
  land: 'Lands',
  end: 'Ends',
};
export default function Summary({ now }: SummaryProps) {
  const defNow = now ?? useNow().application;
  const { info, phases } = nextOrCurrent(defNow);
  const subDisplayComppnents: ReactNode[] = [];
  const mainDisplayComppnents: ReactNode[] = [];

  if (!info.haveShard) {
    mainDisplayComppnents.push(
      <div className='Secondary Display Text'>
        <span className='fillerText'>There is</span>
        <span className='No Shard'>No Shard</span>
        <span className='fillerText'>on</span>
      </div>,
      <Date date={defNow} />,
    );
  } else if (phases) {
    const { land, end } = phases;
    const nextIsLand = defNow < land;
    const [nextPhase, nextTime] = (Object.entries(phases) as [keyof ShardPhases, DateTime][]).reduce(
      ([phase, time], [nextPhase, nextTime]) =>
        defNow <= nextTime && nextTime < time ? [nextPhase, nextTime] : [phase, time],
      ['end', end] as [keyof ShardPhases, DateTime],
    );

    console.log({ nextPhase, nextTime });

    if (nextPhase === 'end') {
      subDisplayComppnents.push(
        <div className='Secondary Display Text'>
          <span className='Status'>Shards Landed</span>
          <span className='fillerText'>since</span>
        </div>,
        <Clock date={land} relative negate trim />,
      );
    } else if (nextPhase !== 'land') {
      subDisplayComppnents.push(
        <div className='Secondary Display Text'>
          <span className='Status'>{phaseNameForSubDisplay[nextPhase]}</span>
          <span className='fillerText'>in</span>
        </div>,
        <Clock date={nextTime} relative trim />,
      );
    }

    mainDisplayComppnents.push(
      <div className='Secondary Display Text'>
        <span className='Red Shard'>Red Shard</span>
        <span className='fillerText'>will</span>
        <span className='Status'>{nextIsLand ? 'Land' : 'End'}</span>
        <span className='fillerText'>in</span>
      </div>,
      <Clock date={nextIsLand ? land : end} relative />,
      <span className='fillerText xs'>Which is</span>,
      <div className='Responsive Display'>
        <div className='Secondary Responsive Display'>
          <div className='Display time-desc'>
            <span className='fillerText'>Your Time: </span>
            <span className='fillerText xs'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          </div>
          <Clock date={nextIsLand ? land : end} local fontSize='var(--font-size-medium)' />
        </div>
        <div className='Secondary Responsive Display'>
          <div className='Display time-desc'>
            <span className='fillerText'>Sky Time: </span>
            <span className='fillerText xs'>(America/Los_Angeles)</span>
          </div>
          {/* <span className='fillerText'>Sky Time: </span> */}
          <Clock date={nextIsLand ? land : end} fontSize='var(--font-size-medium)' />
        </div>
      </div>,
    );
  } else {
    mainDisplayComppnents.push(<span className='Black Shard'>Black Shard</span>);
  }

  if (subDisplayComppnents.length !== 0) {
    return (
      <div id='SummaryPage'>
        <div className='Sub Display'>{subDisplayComppnents}</div>
        <div className='Display'>{mainDisplayComppnents}</div>
      </div>
    );
  } else {
    return (
      <div id='SummaryPage' className='Display'>
        {mainDisplayComppnents}
      </div>
    );
  }
}
