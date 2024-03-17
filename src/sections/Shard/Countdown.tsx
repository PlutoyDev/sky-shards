import { useTranslation, Trans } from 'react-i18next';
import { Settings, Zone } from 'luxon';
import Calendar from '../../components/Calendar';
import StaticClock, { Countdown } from '../../components/Clock';
import { useNow } from '../../context/Now';
import { ShardInfo } from '../../shardPredictor';

export function ShardCountdownSection({ info }: { info: ShardInfo }) {
  const { t } = useTranslation(['countdownSection', 'durationFmts']);
  const { application: now } = useNow();
  const { occurrences } = info;
  const upcommingIndex = occurrences.findIndex(({ end }) => end > now);
  const upcomming = upcommingIndex >= 0 ? occurrences[upcommingIndex] : undefined;
  const landed = upcomming && upcomming.land < now;
  const countdownTo = upcomming && landed ? occurrences[upcommingIndex]?.end : upcomming?.land;

  return (
    <section className='short:min-w-[32rem] short:items-end tall:md:min-w-[16rem] glass grid min-w-[12rem] auto-cols-auto auto-rows-auto place-items-center gap-x-4'>
      {upcomming ? (
        <>
          <div className='short:col-span-1 short:col-start-2 short:row-start-1 tall:md:col-span-2 col-start-1 row-start-1 w-full '>
            <Trans
              t={t}
              i18nKey={landed ? 'landed' : 'landing'}
              components={{
                bold: <span className='whitespace-nowrap font-bold' />,
                countdown: <Countdown to={countdownTo!} />,
                br: <br />,
              }}
              values={{
                i: upcommingIndex,
                landedSince: now.diff(upcomming.land, 'seconds').toFormat(t('durationFmts:hm')),
              }}
            />
          </div>
          <time
            className='short:row-start-1 col-start-1 row-start-2'
            dateTime={countdownTo?.setZone('local')?.toISO({ suppressMilliseconds: true }) ?? undefined}
          >
            <strong>{t('yourTime')}</strong>
            <small className='block'>({(Settings.defaultZone as Zone).name})</small>
            <Calendar date={countdownTo!} convertTo='local' className='block font-bold opacity-80' relFontSize={0.8} />
            <StaticClock time={countdownTo} convertTo='local' className='block font-bold' />
          </time>
          <time
            className='short:col-start-3 short:row-start-1 tall:md:col-start-2 tall:md:row-start-2 col-start-1 row-start-3'
            dateTime={countdownTo?.toISO({ suppressMilliseconds: true }) ?? undefined}
          >
            <strong>{t('skyTime')}</strong>
            <small className='block'>(America/Los_Angeles)</small>
            <Calendar date={countdownTo!} className='block font-bold opacity-80' relFontSize={0.8} />
            <StaticClock time={countdownTo} className='block font-bold' />
          </time>
        </>
      ) : (
        <div className='col-start-1 row-start-1 w-full'>
          <Trans
            t={t}
            tOptions={{ transWrapTextNodes: 'p' }}
            i18nKey='allEnded'
            components={{ bold: <span className='font-bold' />, countdown: <Countdown to={info.lastEnd!} /> }}
          />
        </div>
      )}
    </section>
  );
}
