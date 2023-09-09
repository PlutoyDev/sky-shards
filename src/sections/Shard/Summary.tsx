import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings, Zone } from 'luxon';
import { Calendar, DynamicCalendar } from '../../components/Calendar';
import StaticClock, { Countdown } from '../../components/Clock';
import Emoji from '../../components/Emoji';
import { useNow } from '../../context/Now';
import { getUpcommingShardPhase, ShardInfo } from '../../shardPredictor';

interface ShardSummarySectionProp {
  date: DateTime;
  info: ShardInfo;
}

export default function ShardSummary({ date, info }: ShardSummarySectionProp) {
  const { t } = useTranslation(['skyRealms', 'skyMaps', 'shard', 'shardSummary']);
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
          <DynamicCalendar date={info.date} />
        </section>
      </div>
    );
  } else {
    const upcomming = getUpcommingShardPhase(date, info);
    const landed = upcomming && upcomming.land < date;
    const next = upcomming ? (landed ? upcomming.end : upcomming.land) : undefined;

    return (
      <div
        className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
        ref={summaryRef}
      >
        <section className='glass'>
          <p className='whitespace-normal'>
            <Trans
              t={t}
              i18nKey='shardSummary:info.hasShard'
              components={{
                shard: info.isRed ? (
                  <>
                    <span className='font-bold text-red-600'>{t('shard:color.red')}</span>
                    <Emoji name='Red shard' />
                  </>
                ) : (
                  <>
                    <span className='font-bold text-black'>{t('shard:color.black')}</span>
                    <Emoji name='Black shard' />
                  </>
                ),
                location: (
                  <>
                    <span className='font-bold lg:hidden'>
                      {t(`shardSummary:info.location`, { map: info.map, realm: info.realm, len: 'short' })}
                    </span>
                    <span className='hidden font-bold lg:inline'>
                      {t(`shardSummary:info.location`, { map: info.map, realm: info.realm, len: 'long' })}
                    </span>
                  </>
                ),
                date: <DynamicCalendar date={info.date} />,
              }}
            />
          </p>
          <p className='whitespace-nowrap'>
            <Trans
              t={t}
              {...(info.isRed
                ? {
                    i18nKey: 'shardSummary:info.redShardRewards',
                    values: { qty: info.rewardAC },
                    components: { emoji: <Emoji name='Ascended candle' /> },
                  }
                : {
                    i18nKey: 'shardSummary:info.blackShardRewards',
                    components: { emoji: <Emoji name='Candle cake' /> },
                  })}
            />
          </p>
        </section>
        <section className='glass grid min-w-[12rem] auto-cols-auto auto-rows-auto place-items-center gap-x-4 md:min-w-[16rem] [@media_(max-height:_375px)]:min-w-[32rem] [@media_(max-height:_375px)]:items-end'>
          {upcomming ? (
            <>
              <div className='col-start-1 row-start-1 w-full md:col-span-2 landscape:col-span-2 [@media_(max-height:_375px)]:col-span-1 [@media_(max-height:_375px)]:col-start-2 [@media_(max-height:_375px)]:row-start-1 '>
                <p className='whitespace-nowrap'>
                  {t(`shardSummary:countdown.${landed ? 'landed' : 'landed'}`, { i: upcomming.index })}
                </p>
                <Countdown to={next!} />
              </div>
              <time
                className='col-start-1 row-start-2 [@media_(max-height:_375px)]:row-start-1'
                dateTime={next?.setZone('local')?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>{t('shardSummary:countdown.yourTime')}</strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>
                  ({(Settings.defaultZone as Zone).name})
                </small>
                <Calendar date={next!} convertTo='local' className='block font-bold opacity-80' relFontSize={0.8} />
                <StaticClock time={next} convertTo='local' className='block font-bold' />
              </time>
              <time
                className='col-start-1 row-start-3 md:col-start-2 md:row-start-2 landscape:col-start-2 landscape:row-start-2 [@media_(max-height:_375px)]:col-start-3 [@media_(max-height:_375px)]:row-start-1'
                dateTime={next?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>{t('shardSummary:countdown.skyTime')}</strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>(America/Los_Angeles)</small>
                <Calendar date={next!} className='block font-bold opacity-80' relFontSize={0.8} />
                <StaticClock time={next} className='block font-bold' />
              </time>
            </>
          ) : (
            <div className='col-start-1 row-start-1 w-full'>
              <p className='whitespace-nowrap'>{t('shardSummary:countdown.allEnded')}</p>
              <Countdown to={info.lastEnd!} />
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
          <span>{t('shardSummary:navigation.downwards')}</span>
          <BsChevronCompactDown />
        </small>
      </div>
    );
  }
}
