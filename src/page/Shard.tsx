import { forwardRef, HTMLAttributes, useCallback, useMemo, useRef, useState } from 'react';
import { LoaderFunction, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import { ShardCalendar } from '../sections/Shard/Calendar';
import { ShardDataInfographic, ShardMapInfographic } from '../sections/Shard/Infographic';
import ShardSummary from '../sections/Shard/Summary';
import ShardTimeline from '../sections/Shard/Timeline';
import { getShardInfo } from '../shardPredictor';
import './Shard.css';

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

interface ShardLoaderData {
  isShardPage: true;
  isCalendar?: boolean;
  date?: DateTime;
}

const dragThreshold = 150;
const pinchThreshold = 0.5;
const useGesture = createUseGesture([dragAction, pinchAction]);
const roundToRefDate = (date: DateTime, ref: DateTime) =>
  date.hasSame(ref, 'day') ? ref : date < ref ? date.endOf('day') : date.startOf('day');

export const ShardPageLoader: LoaderFunction = ({ params }): Response | ShardLoaderData => {
  const [route, ...args] = params['*']?.split('/') ?? [];

  if (route === 'calendar') {
    const today = DateTime.local({ zone: 'America/Los_Angeles' });
    const [yearStr, monthStr] = args;
    const year = yearStr ? parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10) : today.year;
    const month = yearStr ? (monthStr ? parseInt(monthStr, 10) : 1) : today.month;

    return {
      isShardPage: true,
      isCalendar: true,
      date: DateTime.local(year, month, 1, { zone: 'America/Los_Angeles' }),
    };
  } else if (route === 'date') {
    const [yearStr, monthStr, dayStr] = args;
    const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
    const month = monthStr ? parseInt(monthStr, 10) : 1;
    const day = dayStr ? parseInt(dayStr, 10) : 1;

    if (year && month && day) {
      const date = DateTime.local(year, month, day, {
        zone: 'America/Los_Angeles',
      });

      if (date.isValid) {
        //Redirect back to home page if date is today
        if (DateTime.local({ zone: 'America/Los_Angeles' }).hasSame(date, 'day')) {
          return redirect(`/`);
        }

        //Minimum date is 2022-10-01
        if (date < DateTime.local(2022, 10, 1, { zone: 'America/Los_Angeles' })) {
          return redirect(`/date/2022/10/01`);
        }

        return {
          isShardPage: true,
          date,
        };
      }
    }
  } else if (Object.keys(relDateMap).includes(route)) {
    return redirect(
      `/date/${DateTime.local()
        .plus({ days: relDateMap[route as keyof typeof relDateMap] })
        .toFormat('yyyy/MM/dd')}`,
    );
  } else if (route === 'next') {
    // const today = DateTime.local().setZone('America/Los_Angeles');
    // if (args[0] === 'red')
    //   return redirect(`/date/${nextShardInfo(today, { colorIsRed: true }).date.toFormat('yyyy/MM/dd')}`);
    // if (args[0] === 'black')
    //   return redirect(`/date/${nextShardInfo(today, { colorIsRed: false }).date.toFormat('yyyy/MM/dd')}`);
    // return redirect(`/date/${nextShardInfo(today).date.toFormat('yyyy/MM/dd')}`);
  }
  return redirect('/');
};

const pendableState = {
  plus: 'plus',
  minus: 'minus',
  calendar: 'calendar',
  date: 'date',
};

export default function Shard() {
  const now = useNow().application;
  const loaderData = (useLoaderData() ?? {}) as ShardLoaderData;
  const date = roundToRefDate(loaderData.date ?? now, now);
  const [pendingDate, setPendingDate] = useState<DateTime | null>(null);
  const isCalendar = loaderData.isCalendar;

  const navigate = useNavigate();
  const [isNavigatable, setIsNavigatable] = useState(true);

  const activeContentRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<HTMLDivElement>(null);
  const [pendingState, setPendingState] = useState<typeof pendableState[keyof typeof pendableState] | null>(null);
  const [hintIdx, setHintIdx] = useState(0);
  const draggedX = useMotionValue(0);

  const contentX = useTransform(
    draggedX,
    [-dragThreshold, 0, dragThreshold],
    [-dragThreshold * 0.7, 0, dragThreshold * 0.7],
    { clamp: false },
  );
  const hintLeftX = useTransform(
    draggedX,
    [-dragThreshold, 0, dragThreshold],
    [-dragThreshold * 0.7, 0, dragThreshold * 0.7],
    { clamp: true },
  );
  const hintRightX = useTransform(
    draggedX,
    [-dragThreshold, 0, dragThreshold],
    [-dragThreshold * 0.7, 0, dragThreshold * 0.7],
    { clamp: true },
  );
  const previousContentX = useTransform(contentX, x => x - window?.innerWidth);
  const nextContentX = useTransform(contentX, x => x + window?.innerWidth);

  const pinchDistance = useMotionValue(1);
  const contentScale = useTransform(
    pinchDistance,
    [1 / pinchThreshold, 1, pinchThreshold],
    [1 / (pinchThreshold * 1.2), 1, pinchThreshold * 1.2],
  );
  const contentOpacity = useTransform(
    pinchDistance,
    [1 / pinchThreshold, 1, pinchThreshold],
    [pinchThreshold * 0.7, 1, pinchThreshold * 0.7],
  );

  const calendarScale = useTransform(contentScale, x => 1 + x);
  const calendarOpacity = useTransform(contentOpacity, x => 1 - x);

  const dateScale = useTransform(contentScale, x => x - 1);
  const dateOpacity = useTransform(contentOpacity, x => 1 - x);

  const navigateLeftRight = useCallback(
    (sign: -1 | 1) => {
      setPendingState(sign === 1 ? pendableState.plus : pendableState.minus);
      setIsNavigatable(false);

      animate(contentX, -window.innerWidth * sign, {
        type: 'spring',
        duration: 0.5,
        onComplete: () => {
          navigate(
            `/${isCalendar ? 'calendar' : 'date'}/${date
              .plus({ [isCalendar ? 'months' : 'days']: sign })
              .toFormat(`yyyy/MM/dd`)}`,
          );
          draggedX.jump(0);
          setHintIdx(0);
          setPendingState(null);
          setIsNavigatable(true);
        },
      });
    },
    [date.day, date.month, date.year, draggedX, contentX, isCalendar],
  );

  const navigateToCalendar = useCallback(() => {
    setPendingState(pendableState.calendar);
    setIsNavigatable(false);
    animate(contentScale, 0, { type: 'spring', duration: 0.5 });
    animate(contentOpacity, 0, {
      type: 'spring',
      duration: 0.51,
      onComplete: () => {
        navigate(`/calendar/${date.toFormat(`yyyy/MM/dd`)}`);
        pinchDistance.jump(1);
        setPendingState(null);
        setIsNavigatable(true);
      },
    });
  }, [date.day, date.month, date.year, contentScale, contentOpacity]);

  const navigateToDate = useCallback(
    (date: DateTime) => {
      setPendingDate(date);
      setPendingState(pendableState.date);
      setIsNavigatable(false);
      animate(contentScale, 2, { type: 'spring', duration: 0.5 });
      animate(contentOpacity, 0, {
        type: 'spring',
        duration: 0.51,
        onComplete: () => {
          navigate(`/date/${date.toFormat(`yyyy/MM/dd`)}`);
          pinchDistance.jump(1);
          setPendingState(null);
          setIsNavigatable(true);
        },
      });
    },
    [date.day, date.month, date.year, contentScale, contentOpacity],
  );

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx] }) => {
        draggedX.set(mx);
        if (Math.abs(mx) > dragThreshold) {
          setHintIdx(2 * Math.sign(mx));
        } else if (Math.abs(mx) > 20) {
          setHintIdx(1 * Math.sign(mx));
          setPendingState(pendableState[mx < 0 ? 'plus' : 'minus']);
        } else {
          setHintIdx(0);
          setPendingState(null);
        }
      },
      onDragEnd: ({ movement: [mx] }) => {
        if (Math.abs(mx) > dragThreshold) {
          if (mx > 0) {
            navigateLeftRight(-1);
          } else {
            navigateLeftRight(1);
          }
        } else {
          animate(draggedX, 0, { type: 'spring', stiffness: 500 });
          setHintIdx(0);
        }
      },
      onPinch: ({ movement: [d] }) => {
        if (!isCalendar && d < 1) {
          pinchDistance.set(d);
          setPendingState(pendableState.calendar);
        }
      },
      onPinchEnd: ({ movement: [d] }) => {
        if (!isCalendar) {
          if (d < pinchThreshold) {
            navigateToCalendar();
          } else {
            animate(pinchDistance, 1, { type: 'spring', stiffness: 500 });
            setPendingState(null);
          }
        }
      },
    },
    {
      drag: { axis: 'x' },
    },
  );

  return (
    <main className='Page ShardPage' {...bind()}>
      <ShardPageContent
        ref={activeContentRef}
        date={date}
        isCalendar={isCalendar}
        onDayClick={navigateToDate}
        style={{ x: contentX, scale: contentScale, opacity: contentOpacity }}
      />

      {pendingState &&
        {
          [pendableState.plus]: (
            <ShardPageContent
              ref={pendingRef}
              date={roundToRefDate(date.plus({ [isCalendar ? 'months' : 'days']: 1 }), now)}
              isCalendar={isCalendar}
              style={{ x: nextContentX }}
            />
          ),
          [pendableState.minus]: (
            <ShardPageContent
              ref={pendingRef}
              date={roundToRefDate(date.minus({ [isCalendar ? 'months' : 'days']: 1 }), now)}
              isCalendar={isCalendar}
              style={{ x: previousContentX }}
            />
          ),
          [pendableState.calendar]: (
            <ShardPageContent
              ref={pendingRef}
              date={date}
              isCalendar={true}
              style={{ scale: calendarScale, opacity: calendarOpacity }}
            />
          ),
          [pendableState.date]: (
            <ShardPageContent
              ref={pendingRef}
              date={roundToRefDate(pendingDate ?? date, now)}
              isCalendar={false}
              style={{ scale: dateScale, opacity: dateOpacity }}
            />
          ),
        }[pendingState]}

      <NavHint
        position='left'
        disabled={Math.sign(hintIdx) === -1 || !isNavigatable}
        hideArrow={Math.abs(hintIdx) === 2}
        hint={
          ['Swipe right or Click here', 'Swipe further', 'Release'][Math.abs(hintIdx)] +
          ` for previous ${isCalendar ? 'month' : 'day'} shard`
        }
        onClick={() => navigateLeftRight(-1)}
        style={{
          x: hintLeftX,
        }}
      />
      <NavHint
        position='right'
        disabled={Math.sign(hintIdx) === 1 || !isNavigatable}
        hideArrow={Math.abs(hintIdx) === 2}
        hint={
          ['Swipe left or Click here', 'Swipe further', 'Release'][Math.abs(hintIdx)] +
          ` for next ${isCalendar ? 'month' : 'day'} shard`
        }
        onClick={() => navigateLeftRight(1)}
        style={{
          x: hintRightX,
        }}
      />
    </main>
  );
}

interface ShardPageContentProps {
  date: DateTime;
  isCalendar?: boolean;
  onDayClick?: (day: DateTime) => void;
  divProps?: HTMLAttributes<HTMLDivElement>;
}

const ShardPageContent = motion(
  forwardRef<HTMLDivElement, ShardPageContentProps>(function ShardPageContent(
    { date, isCalendar, onDayClick, divProps },
    ref,
  ) {
    if (isCalendar) {
      return (
        <div id='shardContent' ref={ref} {...divProps}>
          <ShardCalendar year={date.year} month={date.month} onDayClick={onDayClick} />
        </div>
      );
    }

    const info = getShardInfo(date);

    return (
      <div id='shardContent' ref={ref} {...divProps}>
        <ShardSummary
          date={date}
          info={info}
          includedChild={info.haveShard && <NavHint position='top' hint='Scroll down for more info' />}
        />
        {info.haveShard && (
          <>
            <ShardMapInfographic info={info} />
            <ShardTimeline date={date} info={info} />
            <ShardDataInfographic info={info} />
            <div style={{ minHeight: '60%' }}></div>
          </>
        )}
      </div>
    );
  }),
);

interface NavHintProps {
  hint: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  hideArrow?: boolean;
  onClick?: () => void;
}

const NavHint = motion(
  forwardRef<HTMLDivElement, NavHintProps>(function NavHint({ hint, position, disabled, hideArrow, onClick }, ref) {
    return useMemo(
      () => (
        <div ref={ref} id={`${position}NavHint`} className={`navHint ${disabled ? 'disabled' : ''}`} onClick={onClick}>
          <span className='navHintText'>{hint}</span>

          <svg
            className='navHintArrow'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8 12L12 8L8 4'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeOpacity={hideArrow ? 0 : 1}
            />
          </svg>
        </div>
      ),
      [hint, position, onClick],
    );
  }),
);
