import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCopy } from 'react-icons/fa';
import i18next from 'i18next';
import { ModalProps } from '../../context/ModalContext';

interface GeneratedInfoSetting {
  lanugage: string;
  timezone: string | 'discord';
  date: string;
  inclLink: boolean;
  inclAuthor: boolean;
}

export default function ShareModal({ hideModal }: ModalProps) {
  const { t } = useTranslation('share');
  const canShare = useMemo(() => navigator.share !== undefined && navigator.canShare?.(), []);

  // Separated i18next instance to only render the copying text to a different locale than the rest of the app
  const infoLocale = useMemo(() => i18next.cloneInstance(), []);
  const infoT = useCallback(
    (...p: Parameters<typeof i18next.t>) => {
      const message = infoLocale.t(...p) as string;
      return /<[^>]+>/.test(message) ? message.replace(/<[^>]+>/g, '') : message;
    },
    [infoLocale],
  ) as typeof i18next.t;

  return (
    <div className='mb-4 flex min-w-48 flex-col justify-center gap-2 md:grid md:grid-cols-2 [&>div]:w-full [&>div]:px-2'>
      {/* Share button */}

      <div className='divider my-0.5'>{t('linkTitle')}</div>
      <div className='flex flex-row items-center justify-start gap-4'>
        <button
          className='btn btn-primary btn-sm flex-1'
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            hideModal();
          }}
        >
          <FaCopy size={18} className='mr-2' />
          {t('copy')}
        </button>
        {canShare && (
          <button
            className='btn btn-primary btn-sm flex-1'
            onClick={() => {
              navigator
                .share({
                  title: document.title,
                  url: 'https://sky-shards.pages.dev',
                })
                .then(() => hideModal());
            }}
          >
            {t('send')}
          </button>
        )}
      </div>
      <div className='divider my-0.5'>{t('infoTitle')}</div>
      {/* Copy/Share generated info */}
      {infoT('')}
    </div>
  );
}
