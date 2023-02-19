import { useMemo, useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { getAllShardFullPhases, ShardFullPhases, ShardInfo } from '../../shardPredictor';

const ordinalMap = ['1st', '2nd', '3rd'] as const;

const phasesOrder: (keyof ShardFullPhases)[] = ['earlySky', 'start', 'land', 'end'];

const phasesName: Record<keyof ShardFullPhases, string> = {
  earlySky: 'Early Shard Skies',
  start: 'Gate Shard',
  eruption: 'Eden Eruption',
  land: 'Shard Landing',
  end: 'End of Shard',
};

interface ShardTimelineSectionProp {
  date: DateTime;
  info: ShardInfo;
}

export default function ShardTimeline({ date, info }: ShardTimelineSectionProp) {
  const now = useNow().application;
  const { occurrences, upcommingIndex } = useMemo(() => getAllShardFullPhases(date, info), [date.minute]);
  const [expandedIndex, setExpandedIndex] = useState<0 | 1 | 2 | undefined>(upcommingIndex);
  const miniClockType = Math.floor(now.second / (Math.abs(date.diffNow('days').days) < 3 ? 20 : 30));

  return (
    <section id='shardTimeline' className='glass'>
      <h1 className='title'>
        <span>Timeline for </span>
        <Date date={date} describeClose />
      </h1>
      <div className='timelines'>
        {occurrences.map((phases, i) => (
          <div className='glass' key={i}>
            {/* Accordin with ordinal shard name */}
            <h2
              className='timeline-header'
              onClick={() => setExpandedIndex(expandedIndex === i ? undefined : (i as 0 | 1 | 2))}
            >
              <span className='timeline-header-text'>
                <span className='title'>{ordinalMap[i]} shard </span>
                <span className='mini-clock'>
                  (<span>Landing {miniClockType < 2 ? `[${miniClockType ? 'Your ' : 'Sky '} Timezone]: ` : 'in'}</span>
                  <Clock
                    date={phases.land}
                    inline
                    hideSeconds
                    useSemantic
                    local={miniClockType === 1}
                    relative={miniClockType === 2}
                    twoUnits={miniClockType === 2}
                  />
                  )
                </span>
              </span>
              {/* Expand button */}
              {i === expandedIndex ? (
                <MdExpandMore className='expand-icon' />
              ) : (
                <MdExpandLess className='expand-icon' />
              )}
            </h2>

            {/* Timeline */}
            <div className='timeline' style={expandedIndex === i ? { marginTop: '0.5rem' } : undefined}>
              {expandedIndex === i &&
                phasesOrder.map((pName, pi) => (
                  <div key={`${i}-${pi}`} className='timeline-item'>
                    {/* Timeline Dot */}
                    <div className='timeline-item-dot' />

                    {/* Content */}
                    <div className='timeline-item-content'>
                      <h3 className='timeline-item-header'>{phasesName[pName]}</h3>
                      <time dateTime={phases[pName].toISO()}>
                        <p>
                          Relative: <Clock date={phases[pName]} inline relative twoUnits />
                        </p>
                        <p>
                          Sky Time: <Clock date={phases[pName]} inline hideSeconds />
                        </p>
                        <p>
                          Your Time: <Clock date={phases[pName]} inline local hideSeconds />
                        </p>
                      </time>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
