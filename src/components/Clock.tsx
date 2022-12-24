import { CSSProperties } from 'react';
import { DateTime, Duration } from 'luxon';
import { useNow } from '../context/Now';
import { useSettings } from '../context/Settings';

interface ClockProp {
  local?: boolean;
  relative?: boolean;
  trim?: boolean;
  date?: DateTime;
  duration?: Duration;
  fontSize?: CSSProperties['fontSize'];
  variableWidth?: boolean;
}

const durationFormat = "dd'd' hh'h' mm'm' ss's'";

export default function Clock({ local, relative, trim, date, duration, fontSize, variableWidth }: ClockProp) {
  const { isTwelveHourMode } = useSettings();
  const now = local ? useNow().local : useNow().application;
  date = date || now;
  let text = duration
    ? duration.rescale().toFormat(durationFormat)
    : relative
    ? date.diff(now).rescale().toFormat(durationFormat)
    : date.toFormat(isTwelveHourMode ? 'hh:mm:ss a' : 'HH:mm:ss');

  if (trim) text = text.replace(/^(0+\w )+/, '');

  return (
    <div
      style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {variableWidth || text.length === 0
        ? text
        : text.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                flexBasis: `calc(${fontSize} * 0.84)`,
                padding: 0,
                textAlign: 'center',
              }}
            >
              {char}
            </span>
          ))}
    </div>
  );
}
