import { useTranslation } from 'react-i18next';
import { FaCog, FaCalendarDay } from 'react-icons/fa';
import { DateTime } from 'luxon';
import { DynamicCalendar } from '../../components/Calendar';
import { ClockNow } from '../../components/Clock';
import { useModal } from '../../context/ModalContext';
import { useNow } from '../../context/Now';
import { useSettings } from '../../context/Settings';
import DateSelectionModal from '../Modals/DateSelector';
import SettingsModal from '../Modals/Settings';

function HeaderDateTime({ navigateToday }: { navigateToday: () => void }) {
  const { application: now } = useNow();
  const { t } = useTranslation('application');
  const dateActive = Math.floor(now.second / 6) % 2 === 0;

  return (
    <div
      data-nosnippet
      onClick={navigateToday}
      className='flex cursor-pointer flex-col flex-nowrap items-center justify-center gap-x-3 text-center md:flex-row landscape:flex-row'
    >
      <p
        className='short:swap data-[swap]:short:swap-active max-md:swap data-[swap]:max-md:swap-active tall:md:cursor-pointer tall:md:flex-col tall:md:gap-x-2'
        data-swap={dateActive}
      >
        <DynamicCalendar className='swap-on' />
        <div className='swap-off'>{t('headerDateTimeIndicator')}</div>
      </p>
      <ClockNow dualUnit className='text-md xs:text-2xl' relFontSize={0} />
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation(['application', 'dateSelector', 'settings']);
  const { setSettings } = useSettings();
  const { showModal } = useModal();
  const navigateToday = () => setSettings({ date: DateTime.local({ zone: 'America/Los_Angeles' }) });

  return (
    <header className='glass flex max-h-min flex-row flex-nowrap items-center justify-between px-5'>
      <a href='/' onClick={e => (navigateToday(), e.preventDefault())}>
        <img src='/icons/appName.webp' alt='Sky Shards' className='h-7 w-auto md:h-10' />
      </a>

      <HeaderDateTime navigateToday={navigateToday} />

      <div className='mr-1 flex flex-row flex-nowrap items-center justify-end gap-x-2 lg:gap-x-4'>
        <div className='tooltip tooltip-bottom' data-tip={t('dateSelector:title')}>
          <button
            type='button'
            title={t('dateSelector:title')}
            className='w-min rounded-lg bg-slate-50 bg-opacity-25 p-1.5 shadow-xl shadow-zinc-700 hover:bg-opacity-50'
            onClick={() => {
              showModal({
                children: DateSelectionModal,
                hideOnOverlayClick: true,
                title: t('dateSelector:title'),
              });
            }}
          >
            <FaCalendarDay size={18} />
          </button>
        </div>
        <div className='tooltip tooltip-bottom' data-tip={t('settings:title')}>
          <button
            type='button'
            title={t('settings:title')}
            className='w-min rounded-lg bg-slate-50 bg-opacity-25 p-1.5 shadow-xl shadow-zinc-700 hover:bg-opacity-50'
            onClick={() => {
              showModal({
                children: SettingsModal,
                hideOnOverlayClick: true,
                title: t('settings:title'),
              });
            }}
          >
            <FaCog size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
