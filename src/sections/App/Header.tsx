import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { useHeaderFx } from '../../context/HeaderFx';
import { useSettings } from '../../context/Settings';

interface HeaderProp {
  onThemeButtonClick: () => void;
  onClockButtonClick: () => void;
}

export default function Header({ onThemeButtonClick, onClockButtonClick }: HeaderProp) {
  const { isTwelveHourMode, isLightMode } = useSettings();
  const { navigateDay } = useHeaderFx();

  const navigateToday = () => navigateDay(DateTime.local({ zone: 'America/Los_Angeles' }));

  return (
    <header id='header' className='glass'>
      <a id='title' href='/' onClick={e => (navigateToday(), e.preventDefault())}>
        <span>Sky Shards</span>
      </a>

      <time dateTime={DateTime.utc().toISO()} id='header-dateTime' onClick={navigateToday}>
        <Date hideYear short />
        <Clock sky hideSeconds />
      </time>

      <div id='header-buttons'>
        <button
          onClick={onClockButtonClick}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
        >
          {isTwelveHourMode ? 12 : 24}
        </button>
        <button
          onClick={onThemeButtonClick}
          style={{
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
        >
          {isLightMode ? <BsSunFill /> : <BsMoonFill />}
        </button>
      </div>
    </header>
  );
}
