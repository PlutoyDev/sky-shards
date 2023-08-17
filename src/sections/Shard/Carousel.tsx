import { useState, useEffect, useCallback, useMemo } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import { getShardInfo, findNextShard } from '../../shardPredictor';
import { ShardMapInfographic, ShardDataInfographic } from './Infographic';
import ShardSummary from './Summary';
import ShardTimeline from './Timeline';

const appZone = 'America/Los_Angeles';

const relDateMap = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  tmr: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
};

const replaceUrl = (path: string, pushHistory = true, state: unknown = null) =>
  pushHistory ? history.pushState(state, '', path) : history.replaceState(state, '', path);

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

const getDateFromUrl = () => {
  const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
  const path = window.location.pathname;
  if (path === '/') return today;
  const [route, ...params] = path.split('/').slice(1);
  if (route === 'date') {
    const [yearStr, monthStr, dayStr] = params;
    const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
    const month = monthStr ? parseInt(monthStr, 10) : 1;
    const day = dayStr ? parseInt(dayStr, 10) : 1;

    if (year && month && day) {
      const date = DateTime.local(year, month, day, { zone: appZone });
      if (date.isValid) {
        if (date < DateTime.local(2022, 10, 1, { zone: appZone })) {
          return DateTime.local(2022, 10, 1, { zone: appZone });
        } else if (!DateTime.local({ zone: appZone }).hasSame(date, 'day')) {
          return roundToRefDate(date, today);
        }
      }
    }
  } else if (Object.keys(relDateMap).includes(route)) {
    const offset = relDateMap[route as keyof typeof relDateMap];
    const date = today.plus({ days: offset });
    replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
    return roundToRefDate(date, today);
  } else if (route === 'next') {
    const today = DateTime.local().setZone('America/Los_Angeles');
    const color = params[0] as 'red' | 'black' | undefined;
    const date = findNextShard(today, color && { only: color }).date;
    replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
    return roundToRefDate(date, today);
  }
  replaceUrl('/', false);
  return today;
};

export default function ShardCarousel() {
  const [direction, setDirection] = useState(0);
  const [date, setDate] = useState(() => getDateFromUrl());
  const info = useMemo(() => getShardInfo(date), [date]);

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
      const newDate = getDateFromUrl();
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
    document.title =
      (haveShard ? `${isRed ? 'Red' : 'Black'} Shard in ${map}` : 'No Shard') + ' on ' + date.toFormat('dd LLL yy');
  }, [date, info.haveShard, info.isRed]);

  return (
    <div className='Page ShardPage'>
      <AnimatePresence initial={false} custom={direction}>
        <motion.main
          key={date.toISO()}
          className='shardContent'
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
          <ShardSummary date={date} info={info} />
          {info.haveShard && (
            <>
              <ShardMapInfographic info={info} />
              <ShardTimeline date={date} info={info} />
              <ShardDataInfographic info={info} />
            </>
          )}
        </motion.main>
      </AnimatePresence>
      <div id='leftNavHint' className='navHint' onClick={() => navigateDate(-1)}>
        <span>Swipe right or Click here for previous shard</span>
        <BsChevronRight />
      </div>
      <div id='rightNavHint' className='navHint' onClick={() => navigateDate(1)}>
        <span>Swipe left or Click here for next shard</span>
        <BsChevronLeft />
      </div>
    </div>
  );
}
