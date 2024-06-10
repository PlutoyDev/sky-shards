import { Trans, useTranslation } from 'react-i18next';
import FormatTrans from '../../components/FormatTrans';
import { ModalProps } from '../../context/ModalContext';
import { useRemoteConfig } from '../../data/remoteConfig';

export default function WarningModal({ hideModal }: ModalProps) {
  const { t } = useTranslation('warning');
  const remoteConfig = useRemoteConfig();

  if (!remoteConfig || !remoteConfig.warning) return null;

  const { warning, warningLink } = remoteConfig;

  return (
    <div className='flex flex-col gap-y-4'>
      <h1 className='text-xl font-bold'>{t('title')}</h1>
      <FormatTrans msg={t(`${warning}Msg`)} />
      {warningLink && (
        <>
          <p>
            <Trans
              t={t}
              i18nKey='moreInfo'
              components={{
                a: <a href={warningLink} target='_blank' rel='noreferrer' className='underline hover:text-blue-400' />,
              }}
            />
          </p>
          {warningLink.includes('discord') && <small>({t('moreInfoDiscord')})</small>}
        </>
      )}
    </div>
  );
}
