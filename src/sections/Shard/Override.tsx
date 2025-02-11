// Glass section to let the user know that the calculation has been override by some external source.
import { useTranslation } from 'react-i18next';
import { DailyConfig } from '../../data/remoteConfig';
import { ShardInfo } from '../../data/shard';

interface ShardOverrideSectionProps {
  info: ShardInfo;
  remoteDailyConfig?: DailyConfig;
  remoteAuthorNames?: Record<string, string>;
  toggleApplyOverride: () => void;
}

export function ShardOverrideSection({
  info,
  remoteDailyConfig,
  remoteAuthorNames,
  toggleApplyOverride,
}: ShardOverrideSectionProps) {
  const { t } = useTranslation('override');
  const { override, overrideBy, overrideReason } = remoteDailyConfig ?? {};

  if (!override || !overrideBy || !overrideReason) {
    return null;
  }

  const author = remoteAuthorNames?.[overrideBy];
  const reason: string = overrideReason.startsWith('!!!')
    ? 'Reason: ' + overrideReason.slice(3)
    : // @ts-ignore
      t(`reason.${overrideReason}`);

  return (
    <section className='glass'>
      <p className='font-semibold'>{t('disclosure', { author })}</p>
      <p>{reason}</p>
      <button
        className='btn btn-primary swap btn-sm h-min min-h-0 !p-1 text-[0.8em] data-[active=true]:swap-active'
        onClick={() => toggleApplyOverride()}
        aria-label={t('apply')}
        data-active={info.wasOverride}
      >
        {/* {info.hasOverride ? t('revert') : t('apply')} */}
        <span className='swap-on'>{t('revert')}</span>
        <span className='swap-off'>{t('apply')}</span>
      </button>
    </section>
  );
}

export default ShardOverrideSection;
