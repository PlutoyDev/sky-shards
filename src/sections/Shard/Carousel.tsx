import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronCompactDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { DateTime } from 'luxon';
import { Settings as LuxonSettings } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import { getShardInfo } from '../../shardPredictor';
import { parseUrl, replaceUrl } from '../../utils/parseUrl';
import { ShardCountdownSection } from './Countdown';
import ShardInfoSection from './Info';
import { ShardMapInfographic, ShardDataInfographic } from './Infographic';
import ShardProgress from './Progress';

const appZone = 'America/Los_Angeles';

const roundToRefDate = (date: DateTime, ref: DateTime) =>
  date.hasSame(ref, 'day') ? ref : date < ref ? date.endOf('day') : date.startOf('day');

const varients = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export default function ShardCarousel() {
  const { t, i18n } = useTranslation(['shardCarousel']);

  const [direction, setDirection] = useState(0);
  const [date, setDate] = useState(() =>
    roundToRefDate(parseUrl().date, DateTime.local().setZone(appZone).startOf('day')),
  );
  const info = useMemo(() => getShardInfo(date), [date.day, date.month, date.year]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const navigateDate = useCallback(
    (d: DateTime | number, reUrl = true) => {
      const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
      if (typeof d === 'number') {
        d = date.plus({ days: d });
      }
      setDirection(d > date ? 1 : -1);
      if (d.hasSame(today, 'day')) {
        if (reUrl) replaceUrl({ date: today });
        setDate(today);
      } else {
        if (reUrl) replaceUrl({ date: d });
        setDate(roundToRefDate(d, today));
      }
    },
    [date],
  );

  const { fontSize, setNavigateDay } = useHeaderFx();
  useEffect(() => {
    setNavigateDay(navigateDate);
  }, [navigateDate, setNavigateDay]);

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined = undefined;
    const handleDateChange = () => {
      const newDate = roundToRefDate(parseUrl().date, DateTime.local().setZone(appZone).startOf('day'));
      if (!newDate.hasSame(date, 'day')) {
        navigateDate(newDate, false);
      }
      const msToNextDay = DateTime.local().setZone('America/Los_Angeles').endOf('day').diffNow().as('milliseconds');
      clearTimeout(timeout);
      timeout = setTimeout(handleDateChange, msToNextDay);
    };
    handleDateChange();
    window.addEventListener('popstate', handleDateChange);
    return () => window.removeEventListener('popstate', handleDateChange);
  }, [navigateDate]);

  useEffect(() => {
    const { haveShard, isRed, map } = info;
    const dateString = date.setLocale(LuxonSettings.defaultLocale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    document.title =
      'Sky Shards - ' +
      (haveShard
        ? t('dynamicTitle.hasShard', { color: isRed ? 'red' : 'black', map, date: dateString })
        : t('dynamicTitle.noShard', { date: dateString }));
  }, [date.day, date.month, date.year, info.haveShard, info.isRed, i18n.language]);

  return (
    <div
      className='grid h-full max-h-full w-full select-none grid-cols-[2rem_auto_2rem] grid-rows-[auto] items-center justify-items-center gap-1 overflow-hidden p-2 text-center'
      ref={carouselRef}
    >
      {/* <AnimatePresence initial={false} custom={direction}>
        <main
          key={date.toISO()}
          className='no-scrollbar col-start-2 row-start-1 flex h-full max-h-full w-full flex-col flex-nowrap items-center justify-start gap-2 overflow-x-hidden overflow-y-scroll text-center'
          initial='enter'
          animate='center'
          exit='exit'
          variants={varients}
          transition={{ type: 'spring', duration: 0.3 }}
          custom={direction}
          drag='x'
          // dragSnapToOrigin={true}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          dragMomentum={false}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = offset.x > 0 ? -1 : 1;
            const swipePower = offset.x * velocity.x;
            if (swipePower > 4000) {
              navigateDate(swipe);
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
        </main>
      </AnimatePresence> */}
      <div
        className='relative col-start-1 row-start-1 flex cursor-pointer flex-col-reverse items-center justify-center font-serif text-xs [writing-mode:vertical-rl] [@media_(min-height:_640px)]:xl:text-lg'
        onClick={() => navigateDate(-1)}
      >
        <span>{t('navigation.rightwards')}</span>
        <BsChevronRight className='m-0' strokeWidth={'0.1rem'} />
      </div>
      <div
        className='relative col-start-3 row-start-1 flex cursor-pointer flex-col items-center justify-center font-serif text-xs [writing-mode:vertical-rl] [@media_(min-height:_640px)]:xl:text-lg'
        onClick={() => navigateDate(1)}
      >
        <span>{t('navigation.leftwards')}</span>
        <BsChevronLeft className='m-0' strokeWidth={'0.1rem'} />
      </div>
    </div>
  );
}
