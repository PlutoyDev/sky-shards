import { ReactNode } from 'react';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { getUpcommingShardPhase, ShardInfo } from '../../shardPredictor';

interface ShardSummarySectionProp {
  date: DateTime;
  info: ShardInfo;
  includedChild?: ReactNode;
}

export default function ShardSummary({ date, info, includedChild }: ShardSummarySectionProp) {
  if (!info.haveShard) {
    return (
      <div id='shardSummary'>
        <div id='shardInfo' className='glass'>
          <span>There is </span>
          <span className='font-bold'>No Shard</span>
          <Date date={date} describeClose describeClosePrefix />
        </div>
        {includedChild}
      </div>
    );
  } else {
    const upcomming = getUpcommingShardPhase(date, info);
    const landed = upcomming && upcomming.land < date;
    const next = upcomming ? (landed ? upcomming.end : upcomming.land) : undefined;
    const ordinalIndex = upcomming?.index !== undefined && ['1st', '2nd', '3rd'][upcomming.index];

    return (
      <section id='shardSummary'>
        <summary id='shardInfo' className='glass'>
          <p className='whitespace-normal'>
            <span>There {upcomming ? (landed ? 'is' : 'will be') : 'was'} </span>
            <span className={`${info.isRed ? 'Red' : 'Black'} font-bold whitespace-nowrap`}>
              {info.isRed ? 'Red' : 'Black'} Shard
            </span>
            <span> in </span>
            <span className='font-bold whitespace-nowrap'>{info.map}, </span>
            <span className='font-bold'>{info.realmNick}</span>
            <Date date={date} describeClose describeClosePrefix />
          </p>
          <p>
            <span>Giving </span>
            {info.isRed ? (
              <>
                <span className='font-bold'> max of {info.rewardAC}</span>
                <img className='emoji' src='/emojis/AscendedCandle.webp' alt='Ascended Candles' />
              </>
            ) : (
              <>
                <span className='font-bold'>4</span>
                <img className='emoji' src='/emojis/CandleCake.webp' alt='Candle Cakes' />
                <span> of wax</span>
              </>
            )}
            <span> after first clear</span>
          </p>
        </summary>
        <div id='shardTiming' className='glass'>
          {upcomming ? (
            <>
              <time id='shardCountdown' dateTime={next?.diffNow().toISO()}>
                <span>
                  <span className='font-bold'>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </span>
                  {landed && (
                    <>
                      <span>has </span>
                      <span className='font-bold'>landed </span>
                      <Clock date={upcomming.land} relative negate inline hideSeconds />
                      <span> ago, it </span>
                    </>
                  )}
                  <span>will </span>
                  <span className='font-bold'>{landed ? 'end' : 'land'} </span>
                  <span>in </span>
                </span>
                <Clock date={next} relative trim />
                <span> which is </span>
              </time>
              <time id='shardAbsLocal' dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true })}>
                <span className='font-bold'>Your Time: </span>
                <div className='Demphasized'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</div>
                <Date date={next} local />
                <Clock date={next} local />
              </time>
              <time id='shardAbsSky' dateTime={next?.toISO({ suppressMilliseconds: true })}>
                <span className='font-bold'>Sky Time: </span>
                <div className='Demphasized'>(America/Los_Angeles)</div>
                <Date date={next} />
                <Clock date={next} />
              </time>
            </>
          ) : (
            <div id='shardCountdown'>
              <span> All shard has ended </span>
              <Clock date={info.lastEnd} relative negate />
              <span> ago </span>
            </div>
          )}
        </div>
        {includedChild}
      </section>
    );
  }
}
