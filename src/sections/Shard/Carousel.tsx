import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { createUseGesture, dragAction } from '@use-gesture/react';
import { DateTime } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import { parseUrl, replaceUrl } from '../../utils/parseUrl';
import ShardMain from './Main';

const useDrag = createUseGesture([dragAction]);

const appZone = 'America/Los_Angeles';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const roundToRefDate = (date: DateTime, ref: DateTime) =>
  date.hasSame(ref, 'day') ? ref : date < ref ? date.endOf('day') : date.startOf('day');

export default function ShardCarousel() {
  const { t } = useTranslation(['shardCarousel']);
  const ref = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(() =>
    roundToRefDate(parseUrl().date, DateTime.local().setZone(appZone).startOf('day')),
  );

  const navigateDate = useCallback(
    async (d: DateTime | number, reUrl = true) => {
      const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
      const dir = typeof d === 'number' ? d : d > date ? 1 : -1;
      const toDate = typeof d === 'number' ? date.plus({ days: d }) : d;

      if (date.hasSame(toDate, 'day')) return;

      if (ref.current) {
        ref.current.style.transitionProperty = 'transform, opacity';
        ref.current.style.transform = `translateX(${-dir * 100}%)`;
        ref.current.style.opacity = '0';
        await sleep(75); // 1/2 transition duration
      }
      if (toDate.hasSame(today, 'day')) {
        if (reUrl) replaceUrl({ date: today });
        setDate(today);
      } else {
        if (reUrl) replaceUrl({ date: toDate });
        setDate(roundToRefDate(toDate, today));
      }
      if (ref.current) {
        ref.current.style.transitionProperty = 'none';
        ref.current.style.transform = `translateX(${dir * 100}%)`;
        await sleep(75); // 1/2 transition duration
        ref.current.style.transitionProperty = 'transform, opacity';
        ref.current.style.transform = 'translateX(0)';
        ref.current.style.opacity = '1';
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

  const bind = useDrag({
    onDrag: ({ movement: [x] }) => {
      if (ref.current) {
        ref.current.style.transitionProperty = 'transform';
        ref.current.style.transitionDuration = '25ms';
        ref.current.style.transform = `translateX(${x}px)`;
      }
    },
    onDragEnd: ({ movement: [x], velocity: [vx] }) => {
      if (ref.current) {
        ref.current.style.transitionDuration = '150ms';
        const swipePower = x * vx;
        if (Math.abs(swipePower) > 400) navigateDate(Math.sign(x) * -1);
        else ref.current.style.transform = 'translateX(0)';
      }
    },
  });

  return (
    <div className='grid h-full max-h-full w-full select-none grid-cols-[2rem_auto_2rem] grid-rows-[auto] items-center justify-items-center gap-1 overflow-hidden p-2 text-center'>
      <ShardMain ref={ref} date={date} style={{ fontSize: fontSize + 'em' }} {...bind()} />
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
