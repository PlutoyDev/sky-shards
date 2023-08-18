import { useRef } from 'react';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings, Zone } from 'luxon';
import Calendar from '../../components/Calendar';
import Clock, { Countdown } from '../../components/Clock';
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
      <div
        className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
        ref={summaryRef}
      >
        <section className='glass'>
          <strong>No shard eruption </strong>
          <Calendar date={info.date} relativeFrom={now} />
        </section>
      </div>
    );
  } else {
    const upcomming = getUpcommingShardPhase(date, info);
    const landed = upcomming && upcomming.land < date;
    const next = upcomming ? (landed ? upcomming.end : upcomming.land) : undefined;
    const ordinalIndex = upcomming?.index !== undefined && ['1st', '2nd', '3rd'][upcomming.index];

    return (
      <div
        className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
        ref={summaryRef}
      >
        <section className='glass'>
          <p className='whitespace-normal'>
            {info.isRed ? (
              <>
                <img className='emoji' src='/emojis/ShardRed.webp' alt='' />
                <span className='whitespace-nowrap font-bold text-red-600'>Red shard</span>
              </>
            ) : (
              <>
                <img className='emoji' src='/emojis/ShardBlack.webp' alt='' />
                <span className='whitespace-nowrap font-bold text-black'>Black shard</span>
              </>
            )}
            <span> in </span>
            <span className='font-bold'>{info.map}, </span>
            <span className='font-bold lg:hidden '>{info.realmNick} </span>
            <span className='hidden font-bold lg:inline'>{info.realmFull} </span>
            <Calendar date={info.date} relativeFrom={now} />
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
                        <Clock duration={now.diff(upcomming.land)} hideSeconds className='font-bold' />
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
                <Countdown duration={now.diff(next as DateTime)} />
                <small> which is</small>
              </div>
              <time
                id='shardAbsLocal'
                dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>Your Time: </strong>
                <small className='block'>({(Settings.defaultZone as Zone).name})</small>
                {/* <Date date={next} local /> */}
                <Calendar date={next!} convertTo='local' className='block font-bold' />
                <Clock time={next} convertTo='local' className='block font-bold' />
              </time>
              <time id='shardAbsSky' dateTime={next?.toISO({ suppressMilliseconds: true }) ?? undefined}>
                <strong>Sky Time: </strong>
                <small className='block'>(America/Los_Angeles)</small>
                {/* <Date date={next} /> */}
                <Calendar date={next!} className='block font-bold' />
                <Clock time={next} className='block font-bold' />
              </time>
            </>
          ) : (
            <div id='shardCountdown'>
              <span> All shard has ended </span>
              <Countdown duration={now.diff(info.lastEnd)} />
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
