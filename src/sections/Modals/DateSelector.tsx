import { useMemo, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { DateTime } from 'luxon';
import { StaticClock } from '../../components/Clock';
import { useHeaderFx } from '../../context/HeaderFx';
import type { ModalProps } from '../../context/ModalContext';
import { getShardInfo } from '../../shardPredictor';
import type { ShardInfo } from '../../shardPredictor';
import { parseUrl } from '../../utils/parseUrl';

export function DateSelectionModal({ hideModal }: ModalProps) {
  const today = DateTime.local({ zone: 'America/Los_Angeles' });

  const { t } = useTranslation(['application', 'shard', 'shardSummary', 'skyRealms']);
  const { navigateDay } = useHeaderFx();
  const [showNoShard, setShowNoShard] = useState(() => window.innerWidth >= 768);
  const [selShard, setShard] = useState<0 | 1 | 2>(() => {
    if (today.hour < 8) return 0;
    if (today.hour < 16) return 1;
    return 2;
  });
  const [{ year, month }, setYearMonth] = useState(() => {
    const date = parseUrl();
    return { year: date.year, month: date.month };
  });

  const startOfMth = DateTime.local(year, month, 1, { zone: 'America/Los_Angeles' });
  const endOfMth = startOfMth.endOf('month');
  const daysInMonth = startOfMth.daysInMonth!;

  const shardInfos: [DateTime, ShardInfo][] = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const date = startOfMth.plus({ days: i });
        return [date, getShardInfo(date)];
      }),
    [year, month],
  );

  const nextMonth = startOfMth.plus({ months: 1 });
  const prevMonth = startOfMth.minus({ months: 1 });

  const calStart = startOfMth.startOf('week');
  const calEnd = endOfMth.endOf('week');

  const changeMonth = (delta: -1 | 1) => {
    const newDate = startOfMth.plus({ months: delta });
    setYearMonth({ year: newDate.year, month: newDate.month });
  };

  return (
    <div className='flex max-h-full w-full flex-col flex-nowrap items-center justify-center gap-y-2'>
      <p className='text-center text-lg font-semibold'>
        <span className='whitespace-nowrap'>{startOfMth.toLocaleString({ month: 'long', year: 'numeric' })}</span>{' '}
        <span className='whitespace-nowrap'>
          ({new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(month - today.month, 'months')})
        </span>
      </p>
      <div
        className={
          'no-scrollbar grid max-h-min w-full flex-shrink auto-rows-fr grid-cols-1 gap-2 overflow-y-scroll px-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7' +
          (showNoShard ? ' sm:grid-rows-[auto]' : '')
        }
      >
        {showNoShard &&
          Array.from({ length: 7 }, (_, i) => {
            const { realm, isRed } = shardInfos[i][1];
            const date = calStart.plus({ days: i });
            return (
              <p
                key={`header-${i}`}
                className={
                  'hidden text-center ' +
                  (i < 2 ? 'sm:block ' : i < 4 ? 'lg:block' : i < 5 ? 'xl:block' : i < 7 ? '2xl:block' : '')
                }
              >
                {isRed ? (
                  <span className='hidden text-red-600 sm:max-xl:inline'>Red</span>
                ) : (
                  <span className='hidden text-black sm:max-xl:inline'>Black</span>
                )}
                <span className='hidden xl:max-2xl:inline'>{t(`skyRealms:${realm}.long`)}</span>
                <span className='hidden 2xl:inline'>{date.toLocaleString({ weekday: 'long' })}</span>
              </p>
            );
          })}
        {showNoShard &&
          !calStart.hasSame(startOfMth, 'day') &&
          Array.from({ length: startOfMth.diff(calStart, 'days').days }, (_, i) => {
            const date = calStart.plus({ days: i });
            return (
              <button
                key={`filler-start-${i}`}
                className='btn btn-outline btn-xs !hidden h-full w-full text-white opacity-30 2xl:!block '
                onClick={() => changeMonth(-1)}
              >
                {date.toLocaleString({ day: 'numeric', month: 'long' })}
              </button>
            );
          })}
        {shardInfos.map(([date, info]) => {
          const { haveShard, isRed, occurrences, realm, map } = info;
          const location = info && t('application:dateSelector.location', { map, realm, len: 'short' });
          const isToday = date.hasSame(today, 'day');

          if (!isToday && !showNoShard && !haveShard) return null;

          return (
            <button
              key={date.day}
              className='btn btn-outline btn-xs grid h-full w-full grid-cols-[min-content_auto] grid-rows-2 place-items-center justify-between gap-0.5 px-4 py-0.5 text-white lg:grid-cols-1 lg:grid-rows-[auto_1fr_1fr]'
              onClick={() => {
                hideModal();
                setTimeout(() => navigateDay(date), 100);
              }}
            >
              <p
                className={
                  'rounded-full px-0.5 text-center align-middle text-lg font-bold max-lg:row-span-2 lg:text-xl' +
                  (isToday ? ' border-2 border-dashed border-white' : '') +
                  (haveShard ? (isRed ? ' text-red-600' : ' text-black') : ' opacity-40')
                }
              >
                {date.toFormat('dd')}
              </p>
              {!haveShard ? (
                <p className='row-span-2 w-full text-end align-middle text-xs lg:text-center'>No shard</p>
              ) : (
                <>
                  <p className='w-full align-middle text-xs max-lg:text-end lg:text-center'>
                    <StaticClock time={occurrences[selShard].land} hideSeconds />
                    <span> - </span>
                    <StaticClock time={occurrences[selShard].end} hideSeconds />
                  </p>
                  <p className='w-full align-middle text-xs max-lg:text-end lg:text-center'>{location}</p>
                </>
              )}
            </button>
          );
        })}
        {showNoShard &&
          !calEnd.hasSame(endOfMth, 'day') &&
          Array.from({ length: calEnd.diff(endOfMth, 'days').days }, (_, i) => {
            const date = endOfMth.plus({ days: i + 1 });
            return (
              <button
                key={`filler-end-${i}`}
                className='btn btn-outline btn-xs !hidden h-full w-full text-white opacity-30 2xl:!block '
                onClick={() => changeMonth(1)}
              >
                {date.toLocaleString({ day: 'numeric', month: 'long' })}
              </button>
            );
          })}
      </div>
      <div className='form-control w-full'>
        <label className='label w-full cursor-pointer sm:w-min'>
          <span className='label-text whitespace-nowrap text-white'>Show no shard</span>
          <input
            type='checkbox'
            className='toggle toggle-primary ml-3'
            checked={showNoShard}
            onChange={e => setShowNoShard(e.target.checked)}
          />
        </label>
        <input
          type='range'
          className='range range-primary'
          min='0'
          max='2'
          step='1'
          value={selShard}
          onChange={e => setShard(Number(e.target.value) as 0 | 1 | 2)}
        />
        <div className='flex w-full justify-between px-2 text-xs'>
          <span>{t('shard:ordinal.0')}</span>
          <span>{t('shard:ordinal.1')}</span>
          <span>{t('shard:ordinal.2')}</span>
        </div>
      </div>
      <div className='join m-1.5 px-2'>
        <button
          className='btn btn-primary join-item btn-xs cursor-pointer whitespace-nowrap'
          onClick={e => changeMonth(-1)}
        >
          <BsChevronLeft />
          <span className='md:hidden'>{prevMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
          <span className='max-md:hidden'>{prevMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
        </button>
        <button
          className='btn btn-primary join-item btn-xs cursor-pointer whitespace-nowrap'
          onClick={e => changeMonth(1)}
        >
          <span className='max-md:hidden'>{nextMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
          <span className='md:hidden'>{nextMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
}

interface DateSelectionDayProps {
  date: DateTime;
  noShard?: boolean;
  isToday?: boolean;
  isRed?: boolean;
  isBlack?: boolean;
  location?: string;
  period?: React.ReactNode;
  showNoShard?: boolean;
  onClick?: () => void;
}

export default DateSelectionModal;
