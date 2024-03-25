import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronCompactDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { Settings as LuxonSettings } from 'luxon';
import { useSettings } from '../../context/Settings';
import { type RemoteConfig, fetchRemoteConfig } from '../../data/remoteConfig';
import useLegacyEffect from '../../hooks/useLegacyEffect';
import { getShardInfo } from '../../shardPredictor';
import { ShardCountdownSection } from './Countdown';
import ShardInfoSection from './Info';
import { ShardMapInfographic, ShardDataInfographic } from './Infographic';
import ShardProgress from './Progress';

const varients = {
  enter: (direction: number) => ({ x: direction < 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function ShardCarousel() {
  const { t, i18n } = useTranslation(['shardCarousel']);

  const { date, lang, fontSize, setSettings } = useSettings();
  const prevDate = useRef(date);
  const direction = useMemo(() => (prevDate.current < date ? 1 : -1), [date]);
  useEffect(() => ((prevDate.current = date), undefined), [date]);

  const { info, tmr, ytd } = useMemo(
    () => ({ info: getShardInfo(date), tmr: date.plus({ days: 1 }), ytd: date.minus({ days: 1 }) }),
    [date.day, date.month, date.year],
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { haveShard, isRed, map } = info;
    const dateString = date.setLocale(LuxonSettings.defaultLocale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    document.title =
      (haveShard
        ? t('dynamicTitle.hasShard', { color: isRed ? 'red' : 'black', map, date: dateString })
        : t('dynamicTitle.noShard', { date: dateString })) + ' - Sky Shards';
  }, [date.day, date.month, date.year, info.haveShard, info.isRed, i18n.language]);

  // Fetch remote config on mount
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);
  const manualData = useMemo(() => remoteConfig?.dailyMap[(date as DateTime<true>).toISODate()], [remoteConfig, date]);
  useLegacyEffect(
    () =>
      void fetchRemoteConfig()
        .then(setRemoteConfig)
        .catch(e => console.error('Failed to fetch remote config', e)),
    [],
  );

  return (
    <div
      className='grid h-full max-h-full w-full select-none grid-cols-[2rem_auto_2rem] grid-rows-[auto] items-center justify-items-center gap-1 overflow-hidden p-2 text-center'
      ref={carouselRef}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.main
          key={date.toISODate()}
          className='no-scrollbar col-start-2 row-start-1 flex h-full max-h-full w-full flex-col flex-nowrap items-center justify-start gap-2 overflow-x-hidden overflow-y-scroll text-center'
          initial='enter'
          animate='center'
          exit='exit'
          variants={varients}
          transition={{ type: 'spring', duration: 0.3 }}
          custom={direction}
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          dragMomentum={false}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = offset.x > 0 ? -1 : 1;
            const swipePower = offset.x * velocity.x;
            if (swipePower > 4000) {
              setSettings({ date: date.plus({ days: Math.sign(swipe) }) });
            }
          }}
          style={{ fontSize: `${fontSize}em` }}
        >
          <div className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'>
            <ShardInfoSection info={info} />
            {info.haveShard && (
              <>
                <ShardProgress info={info} />
                <ShardCountdownSection info={info} />
                <small
                  className='flex cursor-pointer flex-col items-center justify-center font-serif text-xs [@media_(min-height:_640px)]:xl:text-lg'
                  onClick={() => {
                    const carousel = carouselRef.current;
                    const content = carousel?.children[0];
                    const summary = content?.children[0];
                    content?.scrollTo({ top: summary?.clientHeight, behavior: 'smooth' });
                  }}
                >
                  <span>{t('navigation.downwards')}</span>
                  <BsChevronCompactDown />
                </small>
              </>
            )}
          </div>
          {info.haveShard && (
            <div className='flex flex-row flex-wrap items-start justify-center gap-6'>
              <ShardMapInfographic info={info} />
              <ShardDataInfographic info={info} />
            </div>
          )}
        </motion.main>
      </AnimatePresence>
      <a
        href={`/${lang}/${ytd.toFormat('yyyy/MM/dd')}`}
        className='relative col-start-1 row-start-1 flex cursor-pointer flex-col-reverse items-center justify-center font-serif text-xs [writing-mode:vertical-rl] [@media_(min-height:_640px)]:xl:text-lg'
        onClick={e => {
          e.preventDefault();
          setSettings({ date: ytd });
        }}
      >
        <span>{t('navigation.rightwards')}</span>
        <BsChevronRight className='m-0' strokeWidth={'0.1rem'} />
      </a>
      <a
        href={`/${lang}/${tmr.toFormat('yyyy/MM/dd')}`}
        className='relative col-start-3 row-start-1 flex cursor-pointer flex-col items-center justify-center font-serif text-xs [writing-mode:vertical-rl] [@media_(min-height:_640px)]:xl:text-lg'
        onClick={e => {
          e.preventDefault();
          setSettings({ date: tmr });
        }}
      >
        <span>{t('navigation.leftwards')}</span>
        <BsChevronLeft className='m-0' strokeWidth={'0.1rem'} />
      </a>
    </div>
  );
}
