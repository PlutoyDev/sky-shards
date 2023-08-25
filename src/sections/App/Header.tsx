import { FaCog } from 'react-icons/fa';
import { DateTime } from 'luxon';
import Calendar from '../../components/Calendar';
import Clock from '../../components/Clock';
import { useHeaderFx } from '../../context/HeaderFx';
import { useModal } from '../../context/ModalContext';
import { useNow } from '../../context/Now';
import SettingsModal from '../Modals/Settings';

export default function Header() {
  const { showModal } = useModal();
  const { navigateDay } = useHeaderFx();
  const navigateToday = () => navigateDay(DateTime.local({ zone: 'America/Los_Angeles' }));
  const { application } = useNow();

  return (
    <header className='glass flex max-h-min flex-row flex-nowrap items-center justify-between px-5'>
      <a
        href='/'
        onClick={e => (navigateToday(), e.preventDefault())}
        className='mb-1 ml-1 cursor-pointer text-left font-[Caramel,_cursive] text-3xl font-bold lg:text-3xl landscape:max-md:text-lg'
      >
        Sky Shards
      </a>

      <time
        dateTime={DateTime.utc().toISO() ?? undefined}
        onClick={navigateToday}
        className='flex cursor-pointer flex-col flex-nowrap items-center justify-center gap-x-3 text-center md:flex-row landscape:flex-row'
      >
        <div className='max-md::text-right flex-col gap-x-2 max-md:grid lg:flex max-md:[&>*]:col-start-1 max-md:[&>*]:row-start-1'>
          <div className='max-md:animate-[dateSwap_10s_linear_infinite]'>Now in sky</div>
          <Calendar date={application} relFontSize={1} className='max-md:animate-[dateSwap_10s_linear_-5s_infinite]' />
        </div>
        <Clock hideSeconds time={application} className='text-2xl landscape:max-lg:text-lg' relFontSize={0} />
      </time>

      <div className='mr-1 flex flex-row flex-nowrap items-center justify-end gap-x-1 lg:gap-x-4'>
        <button
          className='w-min rounded-lg bg-slate-50 bg-opacity-25 p-1.5 shadow-xl shadow-zinc-700 hover:bg-opacity-50'
          onClick={() => {
            showModal({
              children: SettingsModal,
              hideOnOverlayClick: true,
              title: 'Settings',
            });
          }}
        >
          <FaCog size={18} />
        </button>
      </div>
    </header>
  );
}
