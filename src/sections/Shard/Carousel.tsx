import { useState, useEffect, useCallback, useRef, cloneElement } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { createUseGesture, dragAction } from '@use-gesture/react';
import { DateTime } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import { useSettings } from '../../context/Settings';
import { parseUrl, replaceUrl } from '../../utils/parseUrl';
import ShardMain from './Main';

const useDrag = createUseGesture([dragAction]);

const appZone = 'America/Los_Angeles';

const roundToRefDate = (date: DateTime, ref: DateTime) =>
  date.hasSame(ref, 'day') ? ref : date < ref ? date.endOf('day') : date.startOf('day');

export default function ShardCarousel() {
  const { t } = useTranslation(['shardCarousel']);
  const ref = useRef<HTMLElement | null>(null);
  const exitingRef = useRef<HTMLDivElement>(null);
  const primaryElementRef = useRef<JSX.Element | null>(null);
  const exitingElementRef = useRef<JSX.Element | null>(null);

  const { date, setSettings } = useSettings();

  const previousDate = useRef<DateTime>(date);

  const navigateDate = useCallback(
    async (d: DateTime | number, reUrl = true) => {
      const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
      const toDate = typeof d === 'number' ? date.plus({ days: d }) : d;

      if (date.hasSame(toDate, 'day')) return;
      setSettings({ date: toDate }, reUrl);
    },
    [date],
  );

  const { fontSize, setNavigateDay } = useHeaderFx();
  useEffect(() => {
    setNavigateDay(navigateDate);
  }, [navigateDate, setNavigateDay]);

  // useEffect(() => {
  //   let timeout: string | number | NodeJS.Timeout | undefined = undefined;
  //   const handleDateChange = () => {
  //     const newDate = roundToRefDate(parseUrl().date, DateTime.local().setZone(appZone).startOf('day'));
  //     if (!newDate.hasSame(date, 'day')) {
  //       navigateDate(newDate, false);
  //     }
  //     const msToNextDay = DateTime.local().setZone('America/Los_Angeles').endOf('day').diffNow().as('milliseconds');
  //     clearTimeout(timeout);
  //     timeout = setTimeout(handleDateChange, msToNextDay);
  //   };
  //   handleDateChange();
  //   window.addEventListener('popstate', handleDateChange);
  //   return () => window.removeEventListener('popstate', handleDateChange);
  // }, [navigateDate]);

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
        if (Math.abs(swipePower) > 200) navigateDate(Math.sign(x) * -1);
        else ref.current.style.transform = 'translateX(0)';
      }
    },
  });

  useEffect(() => {
    const dateChanged = !previousDate.current.hasSame(date, 'day');
    const dir = previousDate.current < date ? 'rtl' : 'ltr';
    // Set the exiting element
    if (dateChanged && primaryElementRef.current) {
      exitingElementRef.current = cloneElement(primaryElementRef.current, {
        ref: exitingRef,
        style: { transition: 'transform 150ms ease-in-out', fontSize: `${fontSize}em` },
      });
    }

    // Set the primary element
    if (primaryElementRef.current == null || dateChanged) {
      primaryElementRef.current = (
        <ShardMain
          ref={ref}
          key={date.toISODate()}
          date={date}
          {...bind()}
          style={{
            fontSize: `${fontSize}em`,
            transform: !primaryElementRef.current
              ? undefined
              : dir === 'rtl'
                ? 'translateX(100%)'
                : 'translateX(-100%)',
            transition: 'transform 150ms ease-in-out',
          }}
        />
      );
    }

    // If the date is the same, don't animate
    if (!dateChanged) return;

    // If the exiting element is not null, animate
    if (exitingElementRef.current) {
      setTimeout(() => {
        if (exitingRef.current) {
          exitingRef.current.style.transform = dir === 'rtl' ? 'translateX(-100%)' : 'translateX(100%)';
          exitingRef.current.addEventListener('transitionend', () => {
            exitingElementRef.current = null;
            if (ref.current) {
              ref.current.style.transform = 'translateX(0)';
            }
          });
        }
      }, 0); // Wait for the next frame
    }

    // Set the previous date
    previousDate.current = date;
  }, [date, bind]);

  useEffect(() => {
    // Set font size
    if (ref.current) {
      ref.current.style.fontSize = `${fontSize}em`;
    }
  }, [fontSize]);

  return (
    <div className='grid h-full max-h-full w-full select-none grid-cols-[2rem_auto_2rem] grid-rows-[auto] items-center justify-items-center gap-1 overflow-hidden p-2 text-center'>
      {exitingElementRef.current}
      {primaryElementRef.current}
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
