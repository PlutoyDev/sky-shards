import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCopy } from 'react-icons/fa';
import i18next from 'i18next';
import { DateTime } from 'luxon';
import { ModalProps } from '../../context/ModalContext';
import { useSettings } from '../../context/Settings';
import { getShardInfo } from '../../data/shard';
import { languageCode } from '../../i18n';

interface GeneratedInfoSetting {
  lanugage: string;
  timezone: string | 'discord';
  date: DateTime;
  inclLink: boolean;
  inclAuthor: boolean;
}

function renderHtmlTagsAsText(text: string, subsitution?: Record<string, string>) {
  return text.replace(/<[^>]+>/g, tag => subsitution?.[tag] || '');
}

export default function ShareModal({ hideModal }: ModalProps) {
  const { t } = useTranslation(['share', 'settings']);
  const { lang, timezone, date } = useSettings();
  const [genInfoSetting, setGenInfoSetting] = useState<GeneratedInfoSetting>({
    lanugage: lang,
    timezone,
    date,
    inclLink: true,
    inclAuthor: true,
  });

  const canShare = useMemo(() => navigator.share !== undefined && navigator.canShare?.(), []);

  const generatedInfo = useMemo(() => {
    const { lanugage, timezone, date, inclLink, inclAuthor } = genInfoSetting;
    const { hasShard, isRed, occurrences, realm, map } = getShardInfo(date);
    const localT = i18next.getFixedT(lanugage);
    let msg = '';

    const dateTagText = renderHtmlTagsAsText(
      date.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, { locale: lanugage }),
    );
    if (hasShard) {
      const shardTagText = renderHtmlTagsAsText(localT(isRed ? 'infoSection:redShard' : 'infoSection:blackShard'));
      const realmTagText = renderHtmlTagsAsText(localT(`skyRealms:${realm}.long`));
      msg = renderHtmlTagsAsText(localT('infoSection:hasShard', { map }), {
        '<br>': '\n',
        '<shard/>': shardTagText,
        '<realm/>': realmTagText,
        '<date/>': dateTagText,
      });
    } else {
      msg = renderHtmlTagsAsText(localT('infoSection:noShard'), {
        '<br>': '\n',
        '<date/>': dateTagText,
      });
    }
  }, [genInfoSetting, date]);

  return (
    <div className='mb-4 flex min-w-48 flex-col justify-center gap-2 [&>div]:w-full [&>div]:px-2'>
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
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'></div>
    </div>
  );
}
