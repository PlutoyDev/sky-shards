import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import ShardTimeline from './Timeline';
import { useTranslation } from 'react-i18next';
import { BsChevronCompactDown, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { DateTime } from 'luxon';
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
  const { t } = useTranslation(['shardCarousel']);

  const [direction, setDirection] = useState(0);
  const [date, setDate] = useState(() => roundToRefDate(parseUrl(), DateTime.local().setZone(appZone).startOf('day')));
  const info = useMemo(() => getShardInfo(date), [date.day, date.month, date.year]);
  const summaryRef = useRef<HTMLDivElement>(null);

  const navigateDate = useCallback(
    (d: DateTime | number, reUrl = true) => {
      const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
      if (typeof d === 'number') {
        d = date.plus({ days: d });
      }
      setDirection(d > date ? 1 : -1);
      if (d.hasSame(today, 'day')) {
        if (reUrl) replaceUrl('/', false);
        setDate(today);
      } else {
        if (reUrl) replaceUrl(`/date/${d.toFormat('yyyy/MM/dd')}`);
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
      const newDate = roundToRefDate(parseUrl(), DateTime.local().setZone(appZone).startOf('day'));
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
    const dateString = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    document.title =
      'Sky Shards - ' + haveShard
        ? t('dynamicTitle.hasShard', { color: isRed ? 'red' : 'black', map, date: dateString })
        : t('dynamicTitle.noShard', { date: dateString });
    // edit description
    // document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    // (haveShard ? `${isRed ? 'Red' : 'Black'} Shard in ${map}` : 'No Shard') + ' on ' + date.toFormat('dd LLL yy');
  }, [date, info.haveShard, info.isRed]);

  return (
    <div className='grid h-full max-h-full w-full select-none grid-cols-[2rem_auto_2rem] grid-rows-[auto] items-center justify-items-center gap-1 overflow-hidden p-2 text-center'>
      <AnimatePresence initial={false} custom={direction}>
        <motion.main
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
          <div
            className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
            ref={summaryRef}
          >
            <ShardInfoSection info={info} />
            {info.haveShard && (
              <>
                <ShardProgress info={info} />
                <ShardCountdownSection info={info} />
              </>
            )}
            <small
              className="flex cursor-pointer flex-col items-center justify-center whitespace-nowrap font-['Bubblegum_Sans',_cursive] text-xs [@media_(min-height:_640px)]:lg:text-lg"
              onClick={() => {
                summaryRef.current?.parentElement?.scrollBy({
                  top: summaryRef.current?.offsetHeight,
                  behavior: 'smooth',
                });
              }}
            >
              <span>{t('navigation.downwards')}</span>
              <BsChevronCompactDown />
            </small>
          </div>
          {info.haveShard && (
            <>
              <ShardMapInfographic info={info} />
              <ShardDataInfographic info={info} />
            </>
          )}
        </motion.main>
      </AnimatePresence>
      <div
        className="relative col-start-1 row-start-1 flex cursor-pointer flex-col items-center justify-center whitespace-nowrap font-['Bubblegum_Sans',_cursive] text-xs [writing-mode:vertical-lr] [@media_(min-height:_640px)]:lg:text-lg"
        onClick={() => navigateDate(-1)}
      >
        <span>{t('navigation.rightwards')}</span>
        <BsChevronRight className='m-0' strokeWidth={'0.1rem'} />
      </div>
      <div
        className="relative col-start-3 row-start-1 flex cursor-pointer flex-col-reverse items-center justify-center whitespace-nowrap font-['Bubblegum_Sans',_cursive] text-xs [writing-mode:vertical-lr] [@media_(min-height:_640px)]:lg:text-lg"
        onClick={() => navigateDate(1)}
      >
        <span>{t('navigation.leftwards')}</span>
        <BsChevronLeft className='m-0' strokeWidth={'0.1rem'} />
      </div>
    </div>
  );
}
