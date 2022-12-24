import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';

interface HeaderProp {
  isTwelve: boolean;
  onThemeButtonClick: () => void;
  onClockButtonClick: () => void;
}

export default function Header({ isTwelve, onThemeButtonClick, onClockButtonClick }: HeaderProp) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: '1px',
        right: '1px',
        height: { sm: 32, md: 64 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingX: { sm: '5px', md: '1rem' },
        paddingTop: '1rem',
      }}
    >
      <div style={{ flexBasis: '10%' }} />
      <Typography
        component='span'
        sx={{
          fontSize: { sm: '1.2rem', md: '2.8rem' },
        }}
      >
        <strong>Sky Shards</strong>
      </Typography>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          flexBasis: '10%',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          onClick={onClockButtonClick}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
        >
          {isTwelve ? 12 : 24}
        </span>
        <span
          onClick={onThemeButtonClick}
          style={{
            cursor: 'pointer',
            fontSize: '1.2rem',
            paddingTop: '0.5rem',
          }}
        >
          {useTheme().palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        </span>
      </div>
    </Box>
  );
}
