import { CSSProperties } from 'react';
import { DateTime, Duration } from 'luxon';
import { useNow } from '../context/Now';
import { useSettings } from '../context/Settings';
import './Clock.css';

interface ClockProp {
  local?: boolean;
  sky?: boolean;
  negate?: boolean;
  relative?: boolean;
  trim?: boolean;
  date?: DateTime;
  duration?: Duration;
  variableWidth?: boolean;
  fontSize?: CSSProperties['fontSize'];
}

export default function Clock({
  local,
  sky,
  negate,
  relative,
  trim,
  date,
  duration,
  variableWidth,
  fontSize,
}: ClockProp) {
  const { isTwelveHourMode } = useSettings();
  date = local
    ? date?.toLocal() ?? useNow().local
    : (sky ? date?.setZone('America/Los_Angeles') : date) ?? useNow().application;
  duration =
    duration ?? relative ? (negate ? useNow().application.diff(date) : date.diff(useNow().application)) : undefined;

  let text = duration
    ? duration.rescale().toFormat(`hh'h' mm'm' ss's'`)
    : date.toFormat(isTwelveHourMode ? 'hh:mm:ss a' : 'HH:mm:ss');

  if (trim) text = text.replace(/^(0+\w )+/, '');

  return (
    <span className={`Clock${variableWidth ? '' : ' Monospace'}`} style={{ ['--clock-font-size' as string]: fontSize }}>
      {variableWidth || text.length === 0 ? text : text.split('').map((char, index) => <span key={index}>{char}</span>)}
    </span>
  );
}
