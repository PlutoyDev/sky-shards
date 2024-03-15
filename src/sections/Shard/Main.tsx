import { ComponentProps, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronCompactDown } from 'react-icons/bs';
import { DateTime, Settings as LuxonSettings } from 'luxon';
import useLegacyEffect from '../../hooks/useLegacyEffect';
import { getShardInfo } from '../../shardPredictor';
import { ShardCountdownSection } from './Countdown';
import ShardInfoSection from './Info';
import { ShardMapInfographic, ShardDataInfographic } from './Infographic';
import ShardProgress from './Progress';

interface ShardMainProps extends Omit<ComponentProps<'div'>, 'className'> {
  date: DateTime;
  isMain?: boolean;
}

export default function ShardMain({ date, isMain, ...props }: ShardMainProps) {
  const { t, i18n } = useTranslation(['shardCarousel']);
  const info = useMemo(() => getShardInfo(date), [date.day, date.month, date.year]);
  const ref = useRef<HTMLDivElement>(null);

  useLegacyEffect(() => {
    const { haveShard, isRed, map } = info;
    const dateString = date.setLocale(LuxonSettings.defaultLocale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    document.title =
      (haveShard
        ? t('dynamicTitle.hasShard', { color: isRed ? 'red' : 'black', map, date: dateString })
        : t('dynamicTitle.noShard', { date: dateString })) + ' - Sky Shards';
  }, [date.day, date.month, date.year, info.haveShard, info.isRed, i18n.language]);

  const MainOrDiv = isMain ? 'main' : 'div';

  return (
    <MainOrDiv
      ref={ref}
      className='no-scrollbar col-start-2 row-start-1 flex h-full max-h-full w-full flex-col flex-nowrap items-center justify-start gap-2 overflow-x-hidden overflow-y-scroll text-center'
      {...props}
    >
      <div className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'>
        <ShardInfoSection info={info} />
        {info.haveShard && (
          <>
            <ShardProgress info={info} />
            <ShardCountdownSection info={info} />
            <small
              className='flex cursor-pointer flex-col items-center justify-center font-serif text-xs [@media_(min-height:_640px)]:xl:text-lg'
              onClick={() => {
                const carousel = ref.current;
                const content = carousel?.children[0];
                const summary = content?.children[0];
                content?.scrollTo({ top: summary?.clientHeight, behavior: 'smooth' });
              }}
            >
              <span>{t('navigation.downwards')}</span>
              <BsChevronCompactDown />
            </small>
          </>
        )}
      </div>
      {info.haveShard && (
        <div className='flex flex-row flex-wrap items-start justify-center gap-6'>
          <ShardMapInfographic info={info} />
          <ShardDataInfographic info={info} />
        </div>
      )}
    </MainOrDiv>
  );
}
