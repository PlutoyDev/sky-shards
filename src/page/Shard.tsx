import { forwardRef, HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LoaderFunction, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { DateTime } from 'luxon';
import { useNow } from '../context/Now';
import { ShardDataInfographic, ShardMapInfographic } from '../sections/Shard/Infographic';
import ShardSummary from '../sections/Shard/Summary';
import ShardTimeline from '../sections/Shard/Timeline';
import { findNextShard, getShardInfo } from '../shardPredictor';
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
  date: DateTime;
}

const dragThreshold = 150;
const useGesture = createUseGesture([dragAction, pinchAction]);
const roundToRefDate = (date: DateTime, ref: DateTime) =>
  date.hasSame(ref, 'day') ? ref : date < ref ? date.endOf('day') : date.startOf('day');

export const ShardPageLoader: LoaderFunction = ({ params }): Response | ShardLoaderData => {
  const [route, ...args] = params['*']?.split('/') ?? [];

  if (route === 'date') {
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
    const today = DateTime.local().setZone('America/Los_Angeles');
    const color = args[0] as 'red' | 'black' | undefined;
    if (color === 'red' || color === 'black')
      return redirect(`/date/${findNextShard(today, { only: color }).date.toFormat('yyyy/MM/dd')}`);
    return redirect(`/date/${findNextShard(today).date.toFormat('yyyy/MM/dd')}`);
  }
  return redirect('/');
};

type PendingState = 'next' | 'previous' | 'none';

export default function Shard() {
  const now = useNow().application;
  const loaderData = (useLoaderData() ?? {}) as ShardLoaderData;
  const date = roundToRefDate(loaderData.date ?? now, now);

  const navigate = useNavigate();
  const [isNavigatable, setIsNavigatable] = useState(true);

  const [pending, setPending] = useState<PendingState>('none');
  const activeContentRef = useRef<HTMLDivElement>(null);
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
  const pendingContentX = useTransform(contentX, x =>
    pending == 'previous' ? x - window?.innerWidth : pending == 'next' ? x + window?.innerWidth : 0,
  );

  const navigateDay = useCallback(
    (d: DateTime | number) => {
      const diff = typeof d === 'number' ? d : date.diff(d, 'days').days;
      const target = typeof d === 'number' ? date.plus({ days: d }) : d;
      if (diff === 0) return;
      const pendingState = diff < 0 ? 'previous' : 'next';
      if (pending !== pendingState) {
        setPending(diff < 0 ? 'previous' : 'next');
      }
      setIsNavigatable(false);

      animate(contentX, -window.innerWidth * Math.sign(diff), {
        type: 'spring',
        duration: 0.5,
        onComplete: () => {
          navigate(`/date/${target.toFormat(`yyyy/MM/dd`)}`);
          draggedX.jump(0);
          setHintIdx(0);
          setIsNavigatable(true);
          setPending('none');
        },
      });
    },
    [pending, date.day, date.month, date.year, draggedX, contentX],
  );

  const bind = useGesture(
    {
      onDrag: ({ movement: [mx] }) => {
        draggedX.set(mx);
        if (Math.abs(mx) > dragThreshold) {
          setHintIdx(2 * Math.sign(mx));
        } else if (Math.abs(mx) > 20) {
          setHintIdx(1 * Math.sign(mx));
          setPending(mx > 0 ? 'previous' : 'next');
        } else {
          setHintIdx(0);
        }
      },
      onDragEnd: ({ movement: [mx] }) => {
        if (Math.abs(mx) > dragThreshold) {
          if (mx > 0) navigateDay(-1);
          else navigateDay(1);
        } else {
          animate(draggedX, 0, { type: 'spring', stiffness: 500 });
          setHintIdx(0);
        }
      },
    },
    {
      drag: { axis: 'x' },
    },
  );

  //Scroll to top on date change
  useEffect(() => activeContentRef.current?.scrollTo(0, 0), [date.day, date.month, date.year]);

  return (
    <div className='Page ShardPage'>
      <ShardPageContent
        isMain={true}
        ref={activeContentRef}
        date={date}
        divProps={{ ...bind() }}
        style={{
          x: contentX,
        }}
      />
      {pending !== 'none' && (
        <ShardPageContent
          date={roundToRefDate(date.plus({ days: pending === 'previous' ? -1 : 1 }), now)}
          style={{
            x: pendingContentX,
          }}
        />
      )}
      <NavHint
        position='left'
        disabled={Math.sign(hintIdx) === -1 || !isNavigatable}
        hideArrow={Math.abs(hintIdx) === 2}
        hint={
          [
            'Swipe right or Click here for previous day shard',
            'Swipe further for previous day shard',
            'Release for previous day shard',
          ][Math.abs(hintIdx)]
        }
        onClick={() => navigateDay(-1)}
        style={{
          x: hintLeftX,
        }}
      />
      <NavHint
        position='right'
        disabled={Math.sign(hintIdx) === 1 || !isNavigatable}
        hideArrow={Math.abs(hintIdx) === 2}
        hint={
          [
            'Swipe left or Click here for next day shard',
            'Swipe further for next day shard',
            'Release for next day shard',
          ][Math.abs(hintIdx)]
        }
        onClick={() => navigateDay(1)}
        style={{
          x: hintRightX,
        }}
      />
    </div>
  );
}

interface ShardPageContentProps {
  date: DateTime;
  isMain?: boolean;
  divProps?: HTMLAttributes<HTMLDivElement>;
}

const ShardPageContent = motion(
  forwardRef<HTMLDivElement, ShardPageContentProps>(function ShardPageContent({ date, isMain, divProps }, ref) {
    const info = useMemo(() => getShardInfo(date), [date.day, date.month, date.year]);
    const childrens = (
      <>
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
      </>
    );

    useEffect(() => {
      if (isMain) document.title = `Sky Shard Eruption for ${date.toFormat('ccc, dd MMM yyyy')}`;
    }, [date.day, date.month, date.year]);

    if (isMain) {
      return (
        <main id='shardContent' ref={ref} {...divProps}>
          {childrens}
        </main>
      );
    } else {
      return (
        <div id='shardContent' ref={ref} {...divProps}>
          {childrens}
        </div>
      );
    }
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
