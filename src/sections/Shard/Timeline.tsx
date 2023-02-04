import { useMemo, useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { getAllShardFullPhases, ShardFullPhases } from '../../shardPredictor';

const ordinalMap = ['First', 'Second', 'Third'] as const;

const morePhases: (keyof ShardFullPhases)[] = ['earlySky', 'start', 'land', 'end'];

const phasesName: Record<keyof ShardFullPhases, string> = {
  earlySky: 'Early Shard Skies',
  start: 'Gate Shard',
  eruption: 'Eden Eruption',
  land: 'Shard Landing',
  end: 'End of Shard',
};

interface ShardTimelineSectionProp {
  date: DateTime;
}

export default function ShardTimeline({ date }: ShardTimelineSectionProp) {
  const now = useNow().application;
  const { occurrences, upcommingIndex } = getAllShardFullPhases(date);
  const [expandedIndex, setExpandedIndex] = useState<0 | 1 | 2 | undefined>(upcommingIndex);
  const miniClockType = Math.floor(now.second / (Math.abs(date.diffNow('days').days) < 3 ? 20 : 30));

  return (
    <div id='shardTimeline' className='glass'>
      <div className='title'>
        <span>Timeline for </span>
        <Date date={date} describeClose />
      </div>
      <div className='timelines'>
        {occurrences.map((phases, i) => (
          <div className='glass' key={i}>
            {/* Accordin with ordinal shard name */}
            <div
              className='timeline-header'
              onClick={() => setExpandedIndex(expandedIndex === i ? undefined : (i as 0 | 1 | 2))}
            >
              <span className='timeline-header-text'>
                <span className='title'>{ordinalMap[i]} shard </span>
                <span className='mini-clock'>
                  (
                  {useMemo(
                    () =>
                      [
                        <>
                          <span>Your Time: </span>
                          <Clock date={phases.land} local inline />
                        </>,
                        <>
                          <span>Sky Time: </span>
                          <Clock date={phases.land} inline />
                        </>,
                        <>
                          <Clock date={phases.land} relative inline />
                        </>,
                      ][miniClockType],
                    [miniClockType],
                  )}
                  )
                </span>
              </span>
              {/* Expand button */}
              {i === upcommingIndex ? (
                <MdExpandMore className='expand-icon' />
              ) : (
                <MdExpandLess className='expand-icon' />
              )}
            </div>

            {/* Timeline */}
            <div className='timeline' style={expandedIndex === i ? { marginTop: '0.5rem' } : undefined}>
              {expandedIndex === i &&
                morePhases.map((pName, pi) => (
                  <div key={`${i}-${pi}`} className='timeline-item'>
                    {/* Timeline Dot */}
                    <div className='timeline-item-dot' />

                    {/* Content */}
                    <div className='timeline-item-content'>
                      <div className='timeline-item-header'>{phasesName[pName]}</div>
                      <p>
                        Relative: <Clock date={phases[pName]} inline relative />
                      </p>
                      <p>
                        Sky Time: <Clock date={phases[pName]} inline />
                      </p>
                      <p>
                        Your Time: <Clock date={phases[pName]} inline local />
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
