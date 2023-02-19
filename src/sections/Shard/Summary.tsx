import { ReactNode, useRef } from 'react';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { getUpcommingShardPhase, ShardInfo } from '../../shardPredictor';

interface ShardSummarySectionProp {
  date: DateTime;
  info: ShardInfo;
}

export default function ShardSummary({ date, info }: ShardSummarySectionProp) {
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
                  {landed && (
                    <>
                      <span>has </span>
                      <strong>landed </strong>
                      <Clock date={upcomming.land} relative negate inline hideSeconds />
                      <span> ago, it </span>
                    </>
                  )}
                  <span>will </span>
                  <strong>{landed ? 'end' : 'land'} </strong>
                  <span>in </span>
                </span>
                <Clock date={next} relative trim useSemantic />
                <span> which is </span>
              </div>
              <time id='shardAbsLocal' dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true })}>
                <strong>Your Time: </strong>
                <small className='block'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</small>
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
              <Clock date={info.lastEnd} relative negate useSemantic />
              <span> ago </span>
            </div>
          )}
        </section>
        <div
          className='scrollHint'
          onClick={() => {
            summaryRef.current?.parentElement?.scrollBy({
              top: summaryRef.current?.parentElement?.scrollHeight,
              behavior: 'smooth',
            });
          }}
        >
          <span>Scroll down for more info</span>
          <BsChevronCompactDown />
        </div>
      </div>
    );
  }
}
