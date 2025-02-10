import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronCompactDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { Settings as LuxonSettings } from 'luxon';
import { useModal } from '../../context/ModalContext';
import { useSettings } from '../../context/Settings';
import { useRemoteConfig } from '../../data/remoteConfig';
import { getShardInfo } from '../../data/shard';
import useLegacyEffect from '../../hooks/useLegacyEffect';
import WarningModal from '../Modals/Warning';
import { ShardCountdownSection } from './Countdown';
import ShardInfoSection from './Info';
import { ShardMapInfographic, ShardDataInfographic, ShardMemoryInfographic } from './Infographic';
import ShardProgressSection from './Progress';

const varients = {
  enter: (direction: number) => ({ x: direction < 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

export default function ShardCarousel() {
  const { t, i18n } = useTranslation('shardCarousel');
  const [applyOverride, setApplyOverride] = useState(true);

  const { date, lang, fontSize, lastWarn, legTimeline, setSettings } = useSettings();
  const prevDate = useRef(date);
  const direction = useMemo(() => (prevDate.current < date ? 1 : -1), [date]);
  useEffect(() => ((prevDate.current = date), undefined), [date]);

  const { showModal } = useModal();
  const daysDiff = date.diffNow('days').days 
  const remoteConfig = useRemoteConfig(daysDiff < -2 || daysDiff > 0);

  const remoteDailyConfig = useMemo(
    () => remoteConfig?.dailiesMap[date.toISODate() as string] ?? undefined,
    [remoteConfig, date],
  );

  const { info, tmr, ytd } = useMemo(
    () => ({
      info: getShardInfo(date, (applyOverride && remoteDailyConfig?.override) || undefined),
      tmr: date.plus({ days: 1 }),
      ytd: date.minus({ days: 1 }),
    }),
    [date.day, date.month, date.year, applyOverride, remoteDailyConfig],
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { hasShard, isRed, map } = info;
    const dateString = date.setLocale(LuxonSettings.defaultLocale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    document.title =
      (hasShard
        ? t('dynamicTitle.hasShard', { color: isRed ? 'red' : 'black', map, date: dateString })
        : t('dynamicTitle.noShard', { date: dateString })) + ' - Sky Shards';
  }, [date.day, date.month, date.year, info.hasShard, info.isRed, i18n.language]);

  useLegacyEffect(() => {
    if (remoteConfig && remoteConfig.warning) {
      const last = DateTime.fromSeconds(lastWarn).setZone('America/Los_Angeles');
      const shouldWarn = !DateTime.now().setZone('America/Los_Angeles').hasSame(last, 'day');
      if (shouldWarn) {
        showModal({
          children: WarningModal,
          hideCloseButton: true,
        });
      }
    }
  }, [remoteConfig?.warning, lastWarn]);

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
            <ShardInfoSection
              info={info}
              remoteDailyConfig={remoteDailyConfig}
              remoteAuthorNames={remoteConfig?.authorNames}
              toggleOverride={() => setApplyOverride(!applyOverride)}
            />

            {info.hasShard && (
              <>
                {legTimeline && <ShardProgressSection info={info} />}
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
          {info.hasShard && (
            <div className='flex flex-row flex-wrap items-start justify-center gap-6'>
              <ShardMemoryInfographic remoteDailyConfig={remoteDailyConfig} authorNames={remoteConfig?.authorNames} />
              <ShardMapInfographic
                info={info}
                remoteDailyConfig={remoteDailyConfig}
                authorNames={remoteConfig?.authorNames}
              />
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
