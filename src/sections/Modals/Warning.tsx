import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import FormatTrans from '../../components/FormatTrans';
import { ModalProps } from '../../context/ModalContext';
import { useSettings } from '../../context/Settings';
import { useRemoteConfig } from '../../data/remoteConfig';

export default function WarningModal({ hideModal }: ModalProps) {
  const { t } = useTranslation('warning');
  const { setSettings } = useSettings();
  const remoteConfig = useRemoteConfig();

  const dismiss = useCallback(() => {
    setSettings({ lastWarn: DateTime.now().toUnixInteger() });
    hideModal();
  }, [hideModal, setSettings]);

  if (!remoteConfig || !remoteConfig.warning) return null;

  const { warning, warningLink } = remoteConfig;

  return (
    <div className=''>
      <h1 className='text-center text-xl font-bold'>{t('title')}</h1>
      <p className='mt-2'>
        <FormatTrans msg={t(`${warning}Msg`)} />
      </p>
      {warningLink && (
        <p className='mt-2 leading-snug'>
          <Trans
            t={t}
            i18nKey='moreInfo'
            components={{
              a: <a href={warningLink} target='_blank' rel='noreferrer' className='underline hover:text-blue-400' />,
            }}
          />
          <br />
          {warningLink.includes('discord') && <small>({t('moreInfoDiscord')})</small>}
        </p>
      )}
      <p className='mt-2'>
        <FormatTrans msg={t('proceedCaptions')} />
      </p>
      <div className='mx-auto mt-2 w-min'>
        <button type='button' className='btn btn-primary btn-sm rounded-badge' onClick={dismiss}>
          {t('proceed')}
        </button>
      </div>
    </div>
  );
}
