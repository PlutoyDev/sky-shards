import { forwardRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DynamicCalendar } from '../../components/Calendar';
import Emoji from '../../components/Emoji';
import { ShardInfo } from '../../shardPredictor';

interface ShardInfoSectionProps {
  info: ShardInfo;
}

export const ShardInfoSection = forwardRef<HTMLDivElement, ShardInfoSectionProps>(function ShardInfoSection(
  { info },
  ref,
) {
  const { t } = useTranslation(['infoSection', 'skyRealms']);
  if (!info.haveShard) {
    return (
      <div
        className='flex max-h-screen min-h-full w-full flex-col flex-nowrap items-center justify-center gap-1'
        ref={ref}
      >
        <section className='glass'>
          <Trans
            t={t}
            i18nKey='noShard'
            components={{
              date: <DynamicCalendar date={info.date} />,
              bold: <span className='font-bold' />,
            }}
          />
        </section>
      </div>
    );
  }
  return (
    <section className='glass'>
      <p className='whitespace-normal'>
        <Trans
          t={t}
          i18nKey='hasShard'
          components={{
            date: <DynamicCalendar date={info.date} />,
            bold: <span className='font-bold' />,
            realm: (
              <>
                <span className='lg:hidden'>{t(`skyRealms:${info.realm}.short`)}</span>
                <span className='max-lg:hidden'>{t(`skyRealms:${info.realm}.long`)}</span>
              </>
            ),
            shard: info.isRed ? (
              <Trans
                t={t}
                i18nKey='redShard'
                components={{
                  color: <span className='font-bold text-red-600 ' />,
                  emoji: <Emoji name='Red shard' />,
                }}
              />
            ) : (
              <Trans
                t={t}
                i18nKey='blackShard'
                components={{
                  color: <span className='font-bold text-black ' />,
                  emoji: <Emoji name='Black shard' />,
                }}
              />
            ),
          }}
          values={{ color: info.isRed ? 'red' : 'black', map: info.map, realm: info.realm }}
        />
      </p>
      <p className='whitespace-nowrap'>
        <Trans
          t={t}
          {...(info.isRed
            ? {
                i18nKey: 'redShardRewards',
                values: { qty: info.rewardAC },
                components: { emoji: <Emoji name='Ascended candle' /> },
              }
            : {
                i18nKey: 'blackShardRewards',
                components: { emoji: <Emoji name='Candle cake' /> },
              })}
        />
      </p>
    </section>
  );
});

export default ShardInfoSection;
