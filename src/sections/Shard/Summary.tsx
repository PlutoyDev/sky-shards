import { useRef } from 'react';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings, Zone } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { getUpcommingShardPhase, ShardInfo } from '../../shardPredictor';

interface ShardSummarySectionProp {
  date: DateTime;
  info: ShardInfo;
}

export default function ShardSummary({ date, info }: ShardSummarySectionProp) {
  const { application: now } = useNow();
  if (date.hasSame(now, 'day')) date = now;

  const summaryRef = useRef<HTMLDivElement>(null);
  if (!info.haveShard) {
    return (
      <div id='shardSummary'>
        <section id='shardInfo' className='glass'>
          <span>There is </span>
          <strong>No Shard</strong>
          <Date date={date} describeClose describeClosePrefix />
        </section>
      </div>
    );
  } else {
    const upcomming = getUpcommingShardPhase(date, info);
    const landed = upcomming && upcomming.land < date;
    const next = upcomming ? (landed ? upcomming.end : upcomming.land) : undefined;
    const ordinalIndex = upcomming?.index !== undefined && ['1st', '2nd', '3rd'][upcomming.index];

    return (
      <div id='shardSummary' ref={summaryRef}>
        <section id='shardInfo' className='glass'>
          <p className='whitespace-normal'>
            <span>There {upcomming ? (landed ? 'is' : 'will be') : 'was'} </span>
            <strong className={`${info.isRed ? 'Red' : 'Black'} whitespace-nowrap`}>
              {info.isRed ? 'Red' : 'Black'} Shard
            </strong>
            <span> in </span>
            <strong>
              {info.map}, {info.realmNick}
            </strong>
            <Date date={date} describeClose describeClosePrefix />
          </p>
          <p>
            <span>Giving </span>
            {info.isRed ? (
              <>
                <strong> max of {info.rewardAC}</strong>
                <img className='emoji' src='/emojis/AscendedCandle.webp' alt='Ascended Candles' />
              </>
            ) : (
              <>
                <strong>4</strong>
                <img className='emoji' src='/emojis/CandleCake.webp' alt='Candle Cakes' />
                <span> of wax</span>
              </>
            )}
            <span> after first clear</span>
          </p>
        </section>
        <section id='shardTiming' className='glass'>
          {upcomming ? (
            <>
              <div id='shardCountdown'>
                <span>
                  <strong>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </strong>
                  {landed ? (
                    <>
                      <span className='whitespace-nowrap'>
                        has <strong>landed </strong>
                        <Clock date={upcomming.land} relative negate inline hideSeconds fontSize='0.9em' />
                      </span>
                      <span> ago. </span>
                      <span className='whitespace-nowrap'>
                        it will <strong>end in</strong>{' '}
                      </span>
                    </>
                  ) : (
                    <span className='whitespace-nowrap'>
                      will <strong>land in</strong>
                    </span>
                  )}
                </span>
                <Clock date={next} relative trim useSemantic fontSize='1.2em' />
                <small> which is</small>
              </div>
              <time id='shardAbsLocal' dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true })}>
                <strong>Your Time: </strong>
                <small className='block'>({(Settings.defaultZone as Zone).name})</small>
                <Date date={next} local />
                <Clock date={next} local />
              </time>
              <time id='shardAbsSky' dateTime={next?.toISO({ suppressMilliseconds: true })}>
                <strong>Sky Time: </strong>
                <small className='block'>(America/Los_Angeles)</small>
                <Date date={next} />
                <Clock date={next} />
              </time>
            </>
          ) : (
            <div id='shardCountdown'>
              <span> All shard has ended </span>
              <Clock date={info.lastEnd} relative negate useSemantic fontSize='1.2em' />
              <span> ago </span>
            </div>
          )}
        </section>
        <small
          className='scrollHint'
          onClick={() => {
            summaryRef.current?.parentElement?.scrollBy({
              top: summaryRef.current?.offsetHeight,
              behavior: 'smooth',
            });
          }}
        >
          <span>Click here or Scroll down for more info</span>
          <BsChevronCompactDown />
        </small>
      </div>
    );
  }
}
