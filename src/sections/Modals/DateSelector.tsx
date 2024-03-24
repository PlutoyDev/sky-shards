import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { DateTime } from 'luxon';
import { Settings as LuxonSettings } from 'luxon';
import type { ModalProps } from '../../context/ModalContext';
import { useSettings } from '../../context/Settings';
import { getShardInfo } from '../../shardPredictor';
import type { ShardInfo } from '../../shardPredictor';

export function DateSelectionModal({ hideModal }: ModalProps) {
  const { t } = useTranslation(['dateSelector', 'skyRealms', 'skyMaps']);
  const today = DateTime.local({ zone: 'America/Los_Angeles' });

  const { date: selectedDate, lang, numCols, setSettings } = useSettings();

  const navigateDay = useCallback((date: DateTime) => setSettings({ date }), [setSettings]);
  const [{ year, month }, setYearMonth] = useState(() => ({ year: selectedDate.year, month: selectedDate.month }));

  const startOfMth = DateTime.local(year, month, 1, { zone: 'America/Los_Angeles' });
  const endOfMth = startOfMth.endOf('month');
  const daysInMonth = startOfMth.daysInMonth!;

  const shardInfos: [DateTime, ShardInfo][] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = startOfMth.plus({ days: i });
    return [date, getShardInfo(date)];
  });

  const nextMonth = startOfMth.plus({ months: 1 });
  const prevMonth = startOfMth.minus({ months: 1 });

  const calStart = startOfMth.startOf('week');
  const calEnd = endOfMth.endOf('week');

  const changeMonth = (delta: -1 | 1) => {
    const newDate = startOfMth.plus({ months: delta });
    setYearMonth({ year: newDate.year, month: newDate.month });
  };

  const rtf = new Intl.RelativeTimeFormat(LuxonSettings.defaultLocale, { numeric: 'auto' });

  const diffMonths = startOfMth.diff(today.startOf('month'), 'months').months;

  return (
    <div className='flex max-h-full w-full flex-col flex-nowrap items-center justify-center gap-y-2'>
      <p className='text-center text-sm font-semibold'>
        <span className='whitespace-nowrap'>{startOfMth.toLocaleString({ month: 'long', year: 'numeric' })}</span>{' '}
        <span className='whitespace-nowrap'>({rtf.format(diffMonths, 'month')})</span>
      </p>
      <div
        data-wide={numCols === '7'}
        className='no-scrollbar grid max-h-min w-full flex-shrink grid-cols-5 grid-rows-[auto_repeat(7,1fr)] gap-2 overflow-y-scroll px-2 data-[wide=true]:grid-cols-7 data-[wide=true]:grid-rows-[auto_repeat(6,1fr)]'
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
          const isSelected = date.hasSame(selectedDate, 'day');

          return (
            <a
              href={`/${lang}/${date.toFormat('yyyy/MM/dd')}`}
              key={date.day}
              title={date.toLocaleString({ month: 'short', day: 'numeric', year: 'numeric' })}
              data-shard={!haveShard ? 'none' : ''}
              data-selected={isSelected}
              className='btn btn-outline btn-xs block h-full w-full overflow-x-clip py-0.5 !text-white data-[selected=true]:btn-active data-[shard=none]:opacity-30'
              onClick={e => {
                e.preventDefault();
                if (isSelected) return;
                hideModal();
                setTimeout(() => navigateDay(date), 100);
              }}
            >
              <p
                data-shard={haveShard ? (isRed ? 'red' : 'black') : 'none'}
                data-today={isToday}
                className='mx-auto w-min whitespace-nowrap rounded-full px-1 text-center align-middle text-lg font-bold data-[shard=black]:text-black data-[shard=red]:text-red-600 data-[today=true]:underline lg:text-xl data-[shard=none]:dark:opacity-60'
              >
                {date.toFormat('dd')}
              </p>
              <p className='w-full whitespace-nowrap text-center align-middle text-xs max-md:hidden'>
                {haveShard ? t(`skyMaps:${map}`) : t('noShard')}
              </p>
            </a>
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
        <button
          className='btn btn-primary swap btn-xs justify-self-start whitespace-nowrap data-[wide=true]:swap-active'
          onClick={() => setSettings({ numCols: numCols === '5' ? '7' : '5' })}
          data-wide={numCols === '7'}
        >
          <span className='swap-on'>{t('columnType.realm')}</span>
          <span className='swap-off'>{t('columnType.weekday')}</span>
        </button>

        <button className='btn btn-primary btn-xs justify-self-end whitespace-nowrap' onClick={() => changeMonth(-1)}>
          <BsChevronLeft />
          <span className='max-md:hidden'>{prevMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
          <span className='md:hidden'>{prevMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
        </button>
        <button className='btn btn-primary btn-xs justify-self-start whitespace-nowrap' onClick={() => changeMonth(1)}>
          <span className='md:hidden'>{nextMonth.toLocaleString({ month: 'short', year: '2-digit' })}</span>
          <span className='max-md:hidden'>{nextMonth.toLocaleString({ month: 'long', year: 'numeric' })}</span>
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
}

export default DateSelectionModal;
