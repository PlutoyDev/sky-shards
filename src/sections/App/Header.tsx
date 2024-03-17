import { useTranslation } from 'react-i18next';
import { FaCog, FaCalendarDay } from 'react-icons/fa';
import { DateTime } from 'luxon';
import { DynamicCalendar } from '../../components/Calendar';
import { ClockNow } from '../../components/Clock';
import { useHeaderFx } from '../../context/HeaderFx';
import { useModal } from '../../context/ModalContext';
import { useNow } from '../../context/Now';
import DateSelectionModal from '../Modals/DateSelector';
import SettingsModal from '../Modals/Settings';

function HeaderDateTime({ navigateToday }: { navigateToday: () => void }) {
  const { application: now } = useNow();
  const { t } = useTranslation('application');
  const dateActive = Math.floor(now.second / 6) % 2 === 0;

  return (
    <time
      dateTime={now.toISO() ?? undefined}
      onClick={navigateToday}
      className='flex cursor-pointer flex-col flex-nowrap items-center justify-center gap-x-3 text-center md:flex-row landscape:flex-row'
    >
      <label
        className={`max-md:swap ${dateActive ? 'max-md:swap-active' : ''} md:cursor-pointer md:flex-col md:gap-x-2 `}
      >
        <DynamicCalendar className='swap-on' />
        <div className='swap-off'>{t('headerDateTimeIndicator')}</div>
      </label>
      <ClockNow dualUnit className='text-md xs:text-2xl' relFontSize={0} />
    </time>
  );
}

export default function Header() {
  const { t } = useTranslation(['application', 'dateSelector', 'settings']);
  const { showModal } = useModal();
  const { navigateDay } = useHeaderFx();
  const navigateToday = () => navigateDay(DateTime.local({ zone: 'America/Los_Angeles' }));

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
