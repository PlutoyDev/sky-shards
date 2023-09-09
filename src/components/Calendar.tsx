import { CSSProperties, useMemo } from 'react';
import { DateTime, Settings as LuxonSettings } from 'luxon';
import { useNow } from '../context/Now';

interface CalendarProp {
  date: DateTime;
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
  convertTo,
  className = '',
  relFontSize = 1,
  localeOverride,
  allowWrap,
  inline,
}: CalendarProp) {
  return useMemo(() => {
    const style = relFontSize ? ({ fontSize: `${relFontSize}em` } as CSSProperties) : undefined;

    if (!allowWrap) {
      className = `${className} whitespace-nowrap`;
    }

    if (convertTo === 'local') {
      date = date.toLocal();
    } else if (convertTo === 'sky') {
      date = date.setZone('America/Los_Angeles');
    }

    if (date.locale !== LuxonSettings.defaultLocale) {
      date = date.setLocale(LuxonSettings.defaultLocale);
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
  }, [date.day, date.month, date.year]);
}

export default Calendar;

type DynamicCalendarProp = Omit<CalendarProp, 'convertTo' | 'date'> & {
  date?: DateTime;
  invertDiff?: boolean;
};

export function DynamicCalendar({ date, invertDiff, ...calendarProp }: DynamicCalendarProp) {
  const { application, local } = useNow();
  return useMemo(() => {
    if (date) {
      const style = calendarProp.relFontSize
        ? ({ fontSize: `${calendarProp.relFontSize}em` } as CSSProperties)
        : undefined;
      const today = application.startOf('day');
      const rtf = new Intl.RelativeTimeFormat(LuxonSettings.defaultLocale, { numeric: 'auto' });
      date = date.startOf('day');
      const days = date.diff(today, 'days').days;

      return (
        <span className={calendarProp.className} style={style}>
          {rtf.format(days, 'day')}
        </span>
      );
    } else {
      return <Calendar date={application} {...calendarProp} />;
    }
  }, [
    date?.day,
    invertDiff,
    application.day,
    application.month,
    application.year,
    local.day,
    ...Object.values(calendarProp),
  ]);
}
