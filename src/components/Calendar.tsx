import { CSSProperties } from 'react';
import { DateTime } from 'luxon';

interface CalendarProp {
  date: DateTime;
  relativeFrom?: DateTime;
  convertTo?: 'local' | 'sky';
  className?: string;
  relFontSize?: number;
  localeOverride?: Pick<Intl.DateTimeFormatOptions, 'weekday' | 'month' | 'day' | 'year' | 'dateStyle'>;
  allowWrap?: boolean;
  inline?: boolean;
  relativeMaxDays?: number;
}

export function Calendar({
  date,
  relativeFrom,
  convertTo,
  className = '',
  relFontSize = 1,
  localeOverride,
  allowWrap,
  inline,
}: CalendarProp) {
  const style = relFontSize ? ({ fontSize: `${relFontSize}em` } as CSSProperties) : undefined;

  if (!allowWrap) {
    className = `${className} whitespace-nowrap`;
  }

  if (relativeFrom) {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    if (convertTo === 'local') {
      date = date.toLocal();
      relativeFrom = relativeFrom.toLocal();
    } else if (convertTo === 'sky') {
      date = date.setZone('America/Los_Angeles');
      relativeFrom = relativeFrom.setZone('America/Los_Angeles');
    }
    date = date.startOf('day');
    relativeFrom = relativeFrom.startOf('day');
    const days = date.diff(relativeFrom, 'days').days;

    return (
      <span className={className} style={style}>
        {rtf.format(days, 'day')}
      </span>
    );
  } else {
    if (convertTo === 'local') {
      date = date.toLocal();
    } else if (convertTo === 'sky') {
      date = date.setZone('America/Los_Angeles');
    }

    const shortDate = date.toLocaleString({
      calendar: 'gregory',
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      ...localeOverride,
    });

    const mediumDate = date.toLocaleString({
      calendar: 'gregory',
      weekday: 'short',
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      ...localeOverride,
    });

    const longDate = date.toLocaleString({
      calendar: 'gregory',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...localeOverride,
    });

    if (inline) {
      return (
        <>
          <span className={`inline xs:hidden ${className}`} style={style}>
            {shortDate}
          </span>
          <span className={`hidden xs:max-lg:inline ${className}`} style={style}>
            {mediumDate}
          </span>
          <span className={`hidden lg:inline ${className}`} style={style}>
            {longDate}
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className={`block xs:hidden ${className}`} style={style}>
            {shortDate}
          </span>
          <span className={`hidden xs:max-lg:block ${className}`} style={style}>
            {mediumDate}
          </span>
          <span className={`hidden lg:block ${className}`} style={style}>
            {longDate}
          </span>
        </>
      );
    }
  }
}
