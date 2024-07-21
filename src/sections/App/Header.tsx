import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCog, FaCalendarDay, FaEllipsisV, FaAngleRight } from 'react-icons/fa';
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
      className=' flex cursor-pointer flex-col flex-nowrap items-center justify-center gap-x-3 text-center md:flex-row landscape:flex-row'
    >
      <p className='max-md:hidden'>{t('headerDateTimeIndicator')}</p>
      <p
        className='short:swap data-[swap="true"]:short:swap-active max-md:swap data-[swap="true"]:max-md:swap-active tall:md:cursor-pointer tall:md:flex-col tall:md:gap-x-2'
        data-swap={dateActive}
      >
        <DynamicCalendar className='swap-on' />
        <span className='swap-off md:hidden'>{t('headerDateTimeIndicator')}</span>
      </p>
      <ClockNow dualUnit className='text-md xs:text-2xl' relFontSize={0} />
    </div>
  );
}

export function HeaderButton({
  children,
  title,
  isExpand = false,
  onClick,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  isExpand?: boolean;
}) {
  return (
    <div
      className='tooltip tooltip-bottom hidden *:transition-all data-[expand=true]:block md:block md:data-[expand=true]:hidden max-md:group-data-[expand-menu=true]:block'
      data-tip={title}
      data-expand={isExpand}
    >
      <button
        type='button'
        title={title}
        className='w-min rounded-lg bg-slate-50 bg-opacity-25 p-1.5 shadow-xl shadow-zinc-700 hover:bg-opacity-50'
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation(['application', 'dateSelector', 'settings']);
  const { setSettings } = useSettings();
  const { showModal } = useModal();
  const navigateToday = () => setSettings({ date: DateTime.local({ zone: 'America/Los_Angeles' }) });
  const [expandMenu, setExpandMenu] = useState(false);

  return (
    <header
      className='group glass flex max-h-min flex-row flex-nowrap items-center justify-between px-4'
      data-expand-menu={expandMenu}
    >
      <a
        className='max-md:group-data-[expand-menu=true]:hidden'
        href='/'
        onClick={e => (navigateToday(), e.preventDefault())}
      >
        <img src='/icons/appName.webp' alt='Sky Shards' className='h-7 w-auto md:h-10' />
      </a>

      <HeaderDateTime navigateToday={navigateToday} />

      <div className='flex flex-row gap-x-2'>
        <HeaderButton
          title={t('dateSelector:title')}
          onClick={() => {
            showModal({
              children: DateSelectionModal,
              hideOnOverlayClick: true,
              title: t('dateSelector:title'),
            });
          }}
        >
          <FaCalendarDay size={18} />
        </HeaderButton>
        <HeaderButton
          title={t('settings:title')}
          onClick={() => {
            showModal({
              children: SettingsModal,
              hideOnOverlayClick: true,
              title: t('settings:title'),
            });
          }}
        >
          <FaCog size={18} />
        </HeaderButton>
        <HeaderButton isExpand title='Expand' onClick={() => setExpandMenu(!expandMenu)}>
          {expandMenu ? <FaAngleRight size={18} /> : <FaEllipsisV size={18} />}
        </HeaderButton>
      </div>
    </header>
  );
}
