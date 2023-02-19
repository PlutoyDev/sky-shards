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
  fontSize?: CSSProperties['fontSize'];
  inline?: boolean;
  twoUnits?: boolean;
  hideSeconds?: boolean;
  useSemantic?: boolean;
}

export default function Clock({
  local,
  sky,
  negate,
  relative,
  trim,
  date,
  duration,
  fontSize,
  inline,
  twoUnits,
  hideSeconds,
  useSemantic,
}: ClockProp) {
  const { isTwelveHourMode } = useSettings();
  date = local
    ? date?.toLocal() ?? useNow().local
    : (sky ? date?.setZone('America/Los_Angeles') : date) ?? useNow().application;
  duration =
    duration ?? relative ? (negate ? useNow().application.diff(date) : date.diff(useNow().application)) : undefined;

  let text = duration
    ? duration.toFormat(
        twoUnits || hideSeconds
          ? Math.abs(duration.shiftTo('hours').hours) > 2 || hideSeconds
            ? `hh'h' mm'm'`
            : `mm'm' ss's'`
          : `hh'h' mm'm' ss's'`,
      )
    : date.toFormat(
        hideSeconds ? (isTwelveHourMode ? 'hh:mm a' : 'HH:mm') : isTwelveHourMode ? 'hh:mm:ss a' : 'HH:mm:ss',
      );

  if (trim) text = text.replace(/^(0+\w )+/, '');
  const style: CSSProperties = { fontSize, display: inline ? 'inline-block' : undefined };

  if (useSemantic) {
    const isoDateTime = relative
      ? duration?.toISO()
      : date.toISO({ suppressMilliseconds: true, suppressSeconds: hideSeconds });
    return (
      <time className='Clock' style={style} dateTime={isoDateTime}>
        {text}
      </time>
    );
  } else {
    return (
      <span className='Clock' style={style}>
        {text}
      </span>
    );
  }
}
