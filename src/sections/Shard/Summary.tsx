import { useRef } from 'react';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings, Zone } from 'luxon';
import Calendar from '../../components/Calendar';
import Clock, { Countdown } from '../../components/Clock';
import Emoji from '../../components/Emoji';
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
                <Emoji name='Red shard' />
                <span className='whitespace-nowrap font-bold text-red-600'>Red shard</span>
              </>
            ) : (
              <>
                <Emoji name='Black shard' />
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
                <Emoji name='Ascended candle' />
              </>
            ) : (
              <>
                <strong>4</strong>
                <Emoji name='Candle cake' />
                <span> of wax</span>
              </>
            )}
          </p>
        </section>
        <section className='glass grid min-w-[12rem] auto-cols-auto auto-rows-auto place-items-center gap-x-4 md:min-w-[16rem] [@media_(max-height:_375px)]:min-w-[32rem] [@media_(max-height:_375px)]:items-end'>
          {upcomming ? (
            <>
              <div className='col-start-1 row-start-1 w-full md:col-span-2 landscape:col-span-2 [@media_(max-height:_375px)]:col-span-1 [@media_(max-height:_375px)]:col-start-2 [@media_(max-height:_375px)]:row-start-1 '>
                <p className='whitespace-nowrap'>
                  <strong>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </strong>
                  <span>{landed ? 'landed. Ending in' : 'landing in'}</span>
                </p>
                <Countdown duration={now.diff(next as DateTime)} />
                <small> which is</small>
              </div>
              <time
                className='col-start-1 row-start-2 [@media_(max-height:_375px)]:row-start-1'
                dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>Your Time: </strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>
                  ({(Settings.defaultZone as Zone).name})
                </small>
                <Calendar date={next!} convertTo='local' className='block font-bold opacity-80' relFontSize={0.8} />
                <Clock time={next} convertTo='local' className='block font-bold' />
              </time>
              <time
                className='col-start-1 row-start-3 md:col-start-2 md:row-start-2 landscape:col-start-2 landscape:row-start-2 [@media_(max-height:_375px)]:col-start-3 [@media_(max-height:_375px)]:row-start-1'
                dateTime={next?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>Sky Time: </strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>(America/Los_Angeles)</small>
                <Calendar date={next!} className='block font-bold opacity-80' relFontSize={0.8} />
                <Clock time={next} className='block font-bold' />
              </time>
            </>
          ) : (
            <div className='col-start-1 row-start-1 w-full'>
              <span> All shards have </span>
              <span className='whitespace-nowrap font-bold'>ended </span>
              <Countdown duration={now.diff(info.lastEnd)} />
              <span> ago </span>
            </div>
          )}
        </section>
        <small
          className="flex cursor-pointer flex-col items-center justify-center whitespace-nowrap font-['Bubblegum_Sans',_cursive] text-xs [@media_(min-height:_640px)]:lg:text-lg"
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
