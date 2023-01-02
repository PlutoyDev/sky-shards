import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useSettings } from '../../context/Settings';

interface HeaderProp {
  onThemeButtonClick: () => void;
  onClockButtonClick: () => void;
}

export default function Header({ onThemeButtonClick, onClockButtonClick }: HeaderProp) {
  const { isTwelveHourMode, isLightMode } = useSettings();

  return (
    <div id='header' className='glass'>
      <span id='title'>Sky Shards</span>
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
            paddingBottom: '0.3rem',
          }}
        >
          {isLightMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </div>
    </div>
  );
}
