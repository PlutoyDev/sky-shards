import { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings, Zone } from 'luxon';
import { Calendar, DynamicCalendar } from '../../components/Calendar';
import StaticClock, { ClockNow, Countdown } from '../../components/Clock';
import Emoji from '../../components/Emoji';
import { useNow } from '../../context/Now';
import { ShardInfo } from '../../shardPredictor';
import ShardProgress from './Progress';

interface ShardSummarySectionProp {
  date: DateTime;
  info: ShardInfo;
}

export default function ShardSummary({ date, info }: ShardSummarySectionProp) {
  const { t } = useTranslation(['shardSummary', 'skyRealms', 'durationFmts']);
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
          <Trans
            t={t}
            i18nKey='shardSummary:info.noShard'
            components={{
              date: <DynamicCalendar date={info.date} />,
              bold: <span className='font-bold' />,
            }}
          />
        </section>
      </div>
    );
  } else {
    const { occurrences } = info;
    const upcommingIndex = occurrences.findIndex(({ end }) => end > now);
    const upcomming = upcommingIndex >= 0 ? occurrences[upcommingIndex] : undefined;
    const landed = upcomming && upcomming.start < now;
    const countdownTo = upcomming && landed ? occurrences[upcommingIndex]?.end : upcomming?.start;

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
                date: <DynamicCalendar date={info.date} />,
                bold: <span className='font-bold' />,
                realm: (
                  <>
                    <span className='lg:hidden'>{t(`skyRealms:${info.realm}.short`)}</span>
                    <span className='max-lg:hidden'>{t(`skyRealms:${info.realm}.long`)}</span>
                  </>
                ),
                shard: info.isRed ? (
                  <Trans
                    t={t}
                    i18nKey='shardSummary:info.redShard'
                    components={{
                      color: <span className='font-bold text-red-600 ' />,
                      emoji: <Emoji name='Red shard' />,
                    }}
                  />
                ) : (
                  <Trans
                    t={t}
                    i18nKey='shardSummary:info.blackShard'
                    components={{
                      color: <span className='font-bold text-black ' />,
                      emoji: <Emoji name='Black shard' />,
                    }}
                  />
                ),
              }}
              values={{ color: info.isRed ? 'red' : 'black', map: info.map, realm: info.realm }}
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
        <ShardProgress date={date} info={info} />
        <section className='glass grid min-w-[12rem] auto-cols-auto auto-rows-auto place-items-center gap-x-4 md:min-w-[16rem] [@media_(max-height:_375px)]:min-w-[32rem] [@media_(max-height:_375px)]:items-end'>
          {upcomming ? (
            <>
              <div className='col-start-1 row-start-1 w-full md:col-span-2 landscape:col-span-2 [@media_(max-height:_375px)]:col-span-1 [@media_(max-height:_375px)]:col-start-2 [@media_(max-height:_375px)]:row-start-1 '>
                <Trans
                  t={t}
                  i18nKey={`countdown.${landed ? 'landed' : 'landing'}`}
                  components={{ bold: <span className='font-bold' />, countdown: <Countdown to={countdownTo!} /> }}
                  values={{
                    i: upcommingIndex,
                    landedSince: now.diff(upcomming.start, 'seconds').toFormat(t('durationFmts:hm')),
                  }}
                />
              </div>
              <time
                className='col-start-1 row-start-2 [@media_(max-height:_375px)]:row-start-1'
                dateTime={countdownTo?.setZone('local')?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>{t('shardSummary:countdown.yourTime')}</strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>
                  ({(Settings.defaultZone as Zone).name})
                </small>
                <Calendar
                  date={countdownTo!}
                  convertTo='local'
                  className='block font-bold opacity-80'
                  relFontSize={0.8}
                />
                <StaticClock time={countdownTo} convertTo='local' className='block font-bold' />
              </time>
              <time
                className='col-start-1 row-start-3 md:col-start-2 md:row-start-2 landscape:col-start-2 landscape:row-start-2 [@media_(max-height:_375px)]:col-start-3 [@media_(max-height:_375px)]:row-start-1'
                dateTime={countdownTo?.toISO({ suppressMilliseconds: true }) ?? undefined}
              >
                <strong>{t('shardSummary:countdown.skyTime')}</strong>
                <small className='block [@media_(max-height:_375px)]:hidden'>(America/Los_Angeles)</small>
                <Calendar date={countdownTo!} className='block font-bold opacity-80' relFontSize={0.8} />
                <StaticClock time={countdownTo} className='block font-bold' />
              </time>
            </>
          ) : (
            <div className='col-start-1 row-start-1 w-full'>
              <Trans
                t={t}
                tOptions={{ transWrapTextNodes: 'p' }}
                i18nKey='shardSummary:countdown.allEnded'
                components={{ bold: <span className='font-bold' />, countdown: <Countdown to={info.lastEnd!} /> }}
              />
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
