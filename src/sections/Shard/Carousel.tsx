import { useState, useEffect, useCallback } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import { useNow } from '../../context/Now';
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

export default function ShardCarousel() {
  const { application: now } = useNow();
  const [direction, setDirection] = useState(0);

  const getDateFromUrl = useCallback(() => {
    const path = window.location.pathname;
    if (path === '/') return now;
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
            return roundToRefDate(date, now);
          }
        }
      }
    } else if (Object.keys(relDateMap).includes(route)) {
      const offset = relDateMap[route as keyof typeof relDateMap];
      const date = now.plus({ days: offset });
      replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
      return roundToRefDate(date, now);
    } else if (route === 'next') {
      const today = DateTime.local().setZone('America/Los_Angeles');
      const color = params[0] as 'red' | 'black' | undefined;
      const date = findNextShard(today, color && { only: color }).date;
      replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
      return roundToRefDate(date, now);
    }
    replaceUrl('/', false);
    return now;
  }, [now]);

  const [date, setDate] = useState(() => getDateFromUrl());

  const info = getShardInfo(date);

  const navigateDate = useCallback(
    (d: DateTime | number, reUrl = true) => {
      if (typeof d === 'number') {
        d = date.plus({ days: d });
      }
      setDirection(d > date ? 1 : -1);
      if (d.hasSame(now, 'day')) {
        if (reUrl) replaceUrl('/', false);
        setDate(now);
      } else {
        if (reUrl) replaceUrl(`/date/${d.toFormat('yyyy/MM/dd')}`);
        setDate(roundToRefDate(d, now));
      }
    },
    [date, now],
  );

  const { fontSize, setNavigateDay } = useHeaderFx();
  useEffect(() => {
    setNavigateDay(navigateDate);
  }, [navigateDate, setNavigateDay]);

  useEffect(() => {
    const handlePopState = () => {
      navigateDate(getDateFromUrl(), false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getDateFromUrl]);

  return (
    <motion.div
      className='Page ShardPage'
      drag='x'
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      dragMomentum={false}
      onDragEnd={(_, { offset, velocity }) => {
        const swipe = offset.x > 0 ? -1 : 1;
        const swipePower = offset.x * velocity.x;
        console.log('drag ended', swipe, swipePower);
        if (swipePower > 500) {
          navigateDate(swipe);
        }
      }}
      style={{ fontSize: `${fontSize}em` }}
    >
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
    </motion.div>
  );
}
