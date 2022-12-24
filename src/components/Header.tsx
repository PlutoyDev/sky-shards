import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';

interface HeaderProp {
  onThemeButtonClick: () => void;
}

export default function Header({ onThemeButtonClick }: HeaderProp) {
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
        onClick={onThemeButtonClick}
        style={{
          display: 'flex',
          cursor: 'pointer',
          flexFlow: 'row nowrap',
          flexBasis: '10%',
          justifyContent: 'flex-end',
        }}
      >
        {useTheme().palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </div>
    </Box>
  );
}
