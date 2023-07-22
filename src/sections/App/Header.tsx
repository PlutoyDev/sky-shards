import { useEffect } from 'react';
import { FaCog } from 'react-icons/fa';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useHeaderFx } from '../../context/HeaderFx';
import { useModal } from '../../context/ModalContext';
import Announcement_V4 from '../Modals/Announcement_V4';
import SettingsModal from '../Modals/Settings';

export default function Header() {
  const { showModal } = useModal();
  const { navigateDay } = useHeaderFx();
  const navigateToday = () => navigateDay(DateTime.local({ zone: 'America/Los_Angeles' }));

  useEffect(() => {
    // Read if v4 announcement has been dismissed
    const v4AnnouncementDismissed = localStorage.getItem('v4AnnouncementDismissed');
    if (!v4AnnouncementDismissed) {
      setTimeout(() => {
        showModal({
          children: Announcement_V4,
        });
      }, 5000);
    }
  }, []);

  return (
    <header id='header' className='glass'>
      <a id='title' href='/' onClick={e => (navigateToday(), e.preventDefault())}>
        <span>Sky Shards</span>
      </a>

      <time dateTime={DateTime.utc().toISO() ?? undefined} id='header-dateTime' onClick={navigateToday}>
        <Date hideYear short />
        <Clock sky hideSeconds />
      </time>

      <div id='header-buttons'>
        <button
          className='w-min rounded-lg bg-slate-50 bg-opacity-25 p-1.5 shadow-xl shadow-zinc-700 hover:bg-opacity-50'
          onClick={() => {
            showModal({
              children: SettingsModal,
            });
          }}
        >
          <FaCog size={18} />
        </button>
      </div>
    </header>
  );
}
