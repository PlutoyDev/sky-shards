import useMediaQuery from '@mui/material/useMediaQuery';

export default function useSizing() {
  const xs = useMediaQuery('(max-width:320px)');
  const sm = useMediaQuery('(max-width:320px) and (max-width:480px)');
  const md = useMediaQuery('(max-width:480px) and (max-width:768px)');
  const lg = useMediaQuery('(max-width:768px) and (max-width:1024px)');
  const xl = useMediaQuery('(max-width:1024px) and (max-width:1280px)');
  const xxl = useMediaQuery('(max-width:1280px)');
  const breakpoints = { xs, sm, md, lg, xl, xxl };
  const landscape = useMediaQuery('(orientation: landscape)');
  const portrait = useMediaQuery('(orientation: portrait)');

  const anyBreakpont = (...bps: (keyof typeof breakpoints)[]) => bps.some(bp => breakpoints[bp]);

  return {
    breakpoints,
    orientation: {
      landscape,
      portrait,
    },
    devices: {
      isMobile: xs || sm,
      isTablet: md || lg,
      isDesktop: xl || xxl,
    },
    anyBreakpont,
  };
}
