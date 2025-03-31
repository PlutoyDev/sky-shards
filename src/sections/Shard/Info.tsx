import { forwardRef, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Settings as LuxonSettings, Zone } from 'luxon';
import { DynamicCalendar } from '../../components/Calendar';
import { ClockNow } from '../../components/Clock';
import Emoji from '../../components/Emoji';
import { useSettings } from '../../context/Settings';
import { DailyConfig } from '../../data/remoteConfig';
import { ShardInfo } from '../../data/shard';

interface ShardInfoSectionProps {
  info: ShardInfo;
  remoteDailyConfig?: DailyConfig;
  remoteAuthorNames?: Record<string, string>;
  toggleOverride: () => void;
}

export const ShardInfoSection = forwardRef<HTMLDivElement, ShardInfoSectionProps>(function ShardInfoSection(
  { info, remoteDailyConfig, remoteAuthorNames, toggleOverride },
  ref,
) {
  const { legTimeline } = useSettings();
  const { t } = useTranslation(['infoSection', 'skyRealms', 'override', 'shard']);
  const { override, overrideBy, overrideReason, memory, memoryBy } = remoteDailyConfig ?? {};
  const overrideDisclosure = useMemo(() => {
    const hasOverride = override && overrideBy && overrideReason;
    if (!hasOverride) return null;
    const overrideAuthor = remoteAuthorNames?.[overrideBy];
    const reason: string = overrideReason.startsWith('!!!')
      ? 'Reason: ' + overrideReason.slice(3)
      : // @ts-ignore
        t(`override:reason.${overrideReason}`);
    return (
      <small className='text-[0.8em]'>
        <p className='flex flex-row flex-wrap items-center justify-center gap-1'>
          <span className='font-semibold'>{t('override:disclosure', { author: overrideAuthor })} </span>
          <button
            className='btn btn-primary swap btn-sm h-min min-h-0 !p-1 text-[0.8em] data-[active=true]:swap-active'
            onClick={() => toggleOverride()}
            aria-label={info.wasOverride ? t('override:revert') : t('override:apply')}
            data-active={info.wasOverride}
          >
            <span className='swap-on'>{t('override:revert')}</span>
            <span className='swap-off'>{t('override:apply')}</span>
          </button>
        </p>
        <p className='hidden xs:tall:block'>{reason}</p>
        <hr className='mx-auto w-5/6 border-t border-dashed' />
      </small>
    );
  }, [override, overrideBy, overrideReason, t, remoteAuthorNames, toggleOverride]);

  if (!info.hasShard) {
    return (
      <div
        className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
        ref={ref}
      >
        <section className='glass'>
          {overrideDisclosure}
          <Trans
            t={t}
            i18nKey='noShard'
            components={{
              date: <DynamicCalendar date={info.date} />,
              bold: <span className='font-bold' />,
            }}
          />
        </section>
      </div>
    );
  }
  return (
    <section className='glass max-w-full'>
      <p className='whitespace-normal'>
        {overrideDisclosure}
        <Trans
          t={t}
          i18nKey='hasShard'
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
                i18nKey='redShard'
                components={{
                  color: <span className='font-bold text-red-600 ' />,
                  emoji: <Emoji name='Red shard' />,
                }}
              />
            ) : (
              <Trans
                t={t}
                i18nKey='blackShard'
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
      <p className='flex flex-row flex-wrap items-center justify-around justify-items-start gap-x-2 whitespace-nowrap'>
        {info.isRed ? (
          <>
            <span
              className='tooltip tooltip-top underline decoration-dashed md:tooltip-right'
              data-tip={t('redShardRewardNote')}
            >
              <Trans
                t={t}
                i18nKey='redShardRewards'
                values={{ qty: info.rewardAC }}
                components={{ emoji: <Emoji name='Ascended candle' /> }}
              />
            </span>
            {memory || memory === 0 ? (
              <span
                className='tooltip tooltip-top underline decoration-dashed md:tooltip-right'
                data-tip={t('manualMemoryCredit', { author: remoteAuthorNames?.[memoryBy!] })}
              >
                {t('manualMemory', { memory: t(`shard:memories.${memory}`) })}
              </span>
            ) : (
              <span>{t('manualMemory', { memory: t('shard:memories.random') })}</span>
            )}
          </>
        ) : (
          <span>
            <Trans t={t} i18nKey='blackShardRewards' components={{ emoji: <Emoji name='Candle cake' /> }} />
          </span>
        )}
      </p>
      {!legTimeline && (
        <>
          <small className='grid grid-flow-row-dense grid-cols-3 grid-rows-[auto_auto] place-items-center gap-x-2 lg:gap-x-8 tall:max-md:grid-flow-col-dense tall:max-md:grid-cols-[auto_auto] tall:max-md:grid-rows-3 tall:max-md:gap-y-2'>
            {
              // Shard Ordinals
              Array.from({ length: 3 }, (_, i) => (
                <span key={`ordinal.${i}`} className='font-semibold'>
                  {t(`shard:ordinal.${i as 0 | 1 | 2}`)}
                </span>
              ))
            }
            {
              // Shard Time
              info.occurrences.map(({ land, end }, i) => (
                <span key={`time.${i}`}>
                  <ClockNow time={land} strikeThroughPast showLocal /> -{' '}
                  <ClockNow time={end} strikeThroughPast showLocal />
                </span>
              ))
            }
          </small>
          <span className='text-[0.8em]'>{t('schTzFoot', { timezone: (LuxonSettings.defaultZone as Zone).name })}</span>
        </>
      )}
    </section>
  );
});

export default ShardInfoSection;
