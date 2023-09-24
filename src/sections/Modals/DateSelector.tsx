import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { DateTime } from 'luxon';
import { Settings as LuxonSettings } from 'luxon';
import { useHeaderFx } from '../../context/HeaderFx';
import type { ModalProps } from '../../context/ModalContext';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import { getShardInfo } from '../../shardPredictor';
import type { ShardInfo } from '../../shardPredictor';
import { parseUrl } from '../../utils/parseUrl';

export function DateSelectionModal({ hideModal }: ModalProps) {
  const today = DateTime.local({ zone: 'America/Los_Angeles' });

  const { t } = useTranslation(['dateSelector', 'skyRealms', 'skyMaps']);
  const { navigateDay } = useHeaderFx();
  const [numCols, setNumCols] = useLocalStorageState<'5' | '7'>('dateSelector.numCols', '5');
  const [{ year, month }, setYearMonth] = useState(() => {
    const { date } = parseUrl();
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

  const rtf = useMemo(
    () => new Intl.RelativeTimeFormat(LuxonSettings.defaultLocale, { numeric: 'auto' }),
    [LuxonSettings.defaultLocale],
  );

  return (
    <div className='flex max-h-full w-full flex-col flex-nowrap items-center justify-center gap-y-2'>
      <p className='text-center text-sm font-semibold'>
        <span className='whitespace-nowrap'>{startOfMth.toLocaleString({ month: 'long', year: 'numeric' })}</span>{' '}
        <span className='whitespace-nowrap'>({rtf.format(month - today.month, 'months')})</span>
      </p>
      <div
        className={
          'no-scrollbar grid max-h-min w-full flex-shrink auto-cols-fr auto-rows-fr grid-rows-[auto] gap-2 overflow-y-scroll px-2 ' +
          (numCols === '7' ? 'grid-cols-7' : 'grid-cols-5')
        }
      >
        {numCols === '7'
          ? Array.from({ length: 7 }, (_, i) => {
              const date = calStart.plus({ days: i });
              const shortText = date.toLocaleString({ weekday: 'short' });
              const longText = date.toLocaleString({ weekday: 'long' });
              return (
                <p
                  key={`header-${i}`}
                  className='w-full text-center text-xs font-semibold xs:text-sm md:text-lg lg:text-xl'
                >
                  <span className='lg:hidden'>{shortText}</span>
                  <span className='max-lg:hidden'>{longText}</span>
                </p>
              );
            })
          : (['prairie', 'forest', 'valley', 'wasteland', 'vault'] as const).map(realm => {
              const shortText = t(`skyRealms:${realm}.short`);
              const longText = t(`skyRealms:${realm}.long`);
              return (
                <p
                  key={`header-${realm}`}
                  className='w-full overflow-clip text-center text-xs font-semibold xs:text-sm md:text-lg lg:text-xl'
                >
                  <span className='lg:hidden'>{shortText}</span>
                  <span className='max-lg:hidden'>{longText}</span>
                </p>
              );
            })}
        {numCols === '7' &&
          !calStart.hasSame(startOfMth, 'day') &&
          Array.from({ length: startOfMth.diff(calStart, 'days').days }, (_, i) => {
            const date = calStart.plus({ days: i });
            return (
              <button
                key={`filler-start-${i}`}
                className='btn btn-outline btn-xs h-full w-full text-white opacity-30 '
                onClick={() => changeMonth(-1)}
              >
                {date.toLocaleString({ day: 'numeric' })}
              </button>
            );
          })}
        {shardInfos.map(([date, info]) => {
          const { haveShard, isRed, map } = info;
          const isToday = date.hasSame(today, 'day');

          return (
            <button
              key={date.day}
              title={date.toLocaleString({ month: 'short', day: 'numeric', year: 'numeric' })}
              className={
                'btn btn-outline btn-xs grid h-full w-full auto-rows-auto grid-cols-1 grid-rows-[auto] place-items-center content-center justify-between gap-0.5 overflow-x-clip py-0.5 !text-white backdrop-blur' +
                (haveShard ? '' : ' opacity-30')
              }
              onClick={() => {
                hideModal();
                setTimeout(() => navigateDay(date), 100);
              }}
            >
              <p
                className={
                  'rounded-full px-1 text-center align-middle text-lg font-bold lg:text-xl' +
                  (isToday ? ' border-2 border-dashed border-white' : '') +
                  (haveShard ? (isRed ? ' text-red-600' : ' text-black') : ' opacity-30 dark:opacity-60')
                }
              >
                {date.toFormat('dd')}
              </p>
              <p className='w-full whitespace-nowrap text-center align-middle text-xs max-md:hidden'>
                {haveShard ? t(`skyMaps:${map}`) : t('noShard')}
              </p>
            </button>
          );
        })}
        {numCols === '7' &&
          !calEnd.hasSame(endOfMth, 'day') &&
          Array.from({ length: calEnd.diff(endOfMth, 'days').days }, (_, i) => {
            const date = endOfMth.plus({ days: i + 1 });
            return (
              <button
                key={`filler-end-${i}`}
                className='btn btn-outline btn-xs h-full w-full text-white opacity-30 '
                onClick={() => changeMonth(1)}
              >
                {date.toLocaleString({ day: 'numeric' })}
              </button>
            );
          })}
      </div>
      <div className='mb-2 grid w-full grid-cols-2 grid-rows-2 place-items-center gap-2 lg:grid-cols-4 lg:grid-rows-1'>
        <p className='text-bold justify-self-end'>{t('columnType')}:</p>
        <select
          className='no-scrollbar select select-primary select-xs mt-1 inline-block justify-self-start bg-primary text-primary-content'
          onChange={e => setNumCols(e.target.value as typeof numCols)}
          value={numCols}
        >
          <option value={5}>{t('columnType.realm')}</option>
          <option value={7}>{t('columnType.weekday')}</option>
        </select>
        <button className='btn btn-primary btn-xs justify-self-end whitespace-nowrap' onClick={e => changeMonth(-1)}>
          <BsChevronLeft />
          <span className='max-md:hidden'>{prevMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
          <span className='md:hidden'>{prevMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
        </button>
        <button className='btn btn-primary btn-xs justify-self-start whitespace-nowrap' onClick={e => changeMonth(1)}>
          <span className='md:hidden'>{nextMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
          <span className='max-md:hidden'>{nextMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
}

export default DateSelectionModal;
