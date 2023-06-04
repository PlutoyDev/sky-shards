import { useEffect, useMemo, useRef } from 'react';
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
  const occurrences = useMemo(() => getAllShardFullPhases(date, info), [date.day]);
  const expanded = useRef<[boolean, boolean, boolean]>([false, false, false]);
  const miniClockType = Math.floor(now.second / (Math.abs(date.diffNow('days').days) < 3 ? 20 : 30));

  const upcommingIndex = useMemo(
    () =>
      occurrences.reduceRight(
        (acc, { end }, idx) => (acc === undefined && now < end ? idx : acc),
        undefined as number | undefined,
      ),
    [...occurrences.map(({ end }) => end), now.minute],
  );

  useEffect(() => {
    const countExpanded = expanded.current.reduce((acc, cur) => acc + (cur ? 1 : 0), 0);
    const prevIndex = upcommingIndex !== undefined ? upcommingIndex - 1 : 2;
    if (countExpanded === 1 && expanded.current[prevIndex]) expanded.current[prevIndex] = false;
    if (upcommingIndex !== undefined) expanded.current[upcommingIndex] = true;
    else expanded.current = [false, false, true];
  }, [upcommingIndex]);

  return (
    <section id='shardTimeline' className='glass'>
      <h1 className='title'>
        <span>Timeline for </span>
        <Date date={date} describeClose />
      </h1>
      <div className='timelines'>
        {occurrences.map((phases, oI) => {
          const occurIndex = oI as 0 | 1 | 2;
          return (
            <div className='glass' key={occurIndex}>
              {/* Accordin with ordinal shard name */}
              <h2
                className='timeline-header'
                onClick={() => (expanded.current[occurIndex] = !expanded.current[occurIndex])}
              >
                <span className='timeline-header-text'>
                  <span className='title'>{ordinalMap[occurIndex]} shard </span>
                  <span className='mini-clock'>
                    (<span>Landing {miniClockType < 2 ? `[${miniClockType ? 'Your ' : 'Sky '} Time]:` : 'in'} </span>
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
                {!expanded.current[occurIndex] ? (
                  <MdExpandMore className='expand-icon' />
                ) : (
                  <MdExpandLess className='expand-icon' />
                )}
              </h2>

              {/* Timeline */}
              <div className='timeline' style={expanded.current[occurIndex] ? { marginTop: '0.5rem' } : undefined}>
                {expanded.current[occurIndex] &&
                  phasesOrder.map((pName, pi) => (
                    <div key={`${occurIndex}-${pi}`} className='timeline-item'>
                      {/* Timeline Dot */}
                      <div className='timeline-item-dot' />

                      {/* Content */}
                      <div className='timeline-item-content'>
                        <h3 className='timeline-item-header'>{phasesName[pName]}</h3>
                        <time dateTime={phases[pName].toISO() ?? undefined}>
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
          );
        })}
      </div>
    </section>
  );
}
