import { DateTime } from 'luxon';
import { findNextShard } from '../shardPredictor';

const appZone = 'America/Los_Angeles';

const relDateMap = {
  eytd: -2,
  ereyesterday: -2,
  ytd: -1,
  yesterday: -1,
  tmr: 1,
  tomorrow: 1,
  ovmr: 2,
  overmorrow: 2,
};

export function replaceUrl(path: string, pushHistory = true, state: unknown = null) {
  if (pushHistory) {
    history.pushState(state, '', path);
  } else {
    history.replaceState(state, '', path);
  }
}

export function parseUrl() {
  const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
  const path = window.location.pathname;
  if (path === '/') return today;
  const [route, ...params] = path.split('/').slice(1);
  if (route === 'date') {
    const [yearStr, monthStr, dayStr] = params;
    const year = parseInt(yearStr.length === 2 ? `20${yearStr}` : yearStr, 10);
    const month = monthStr ? parseInt(monthStr, 10) : 1;
    const day = dayStr ? parseInt(dayStr, 10) : 1;

    if (year && month && day) {
      const date = DateTime.local(year, month, day, { zone: appZone });
      if (date.isValid) {
        if (date < DateTime.local(2022, 10, 1, { zone: appZone })) {
          return DateTime.local(2022, 10, 1, { zone: appZone });
        } else if (!DateTime.local({ zone: appZone }).hasSame(date, 'day')) {
          return date;
        }
      }
    }
  } else if (Object.keys(relDateMap).includes(route)) {
    const offset = relDateMap[route as keyof typeof relDateMap];
    const date = today.plus({ days: offset });
    replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
    return date;
  } else if (route === 'next') {
    const today = DateTime.local().setZone('America/Los_Angeles');
    const color = params[0] as 'red' | 'black' | undefined;
    const date = findNextShard(today, color && { only: color }).date;
    replaceUrl(`/date/${date.toFormat('yyyy/MM/dd')}`, false);
    return date;
  }
  replaceUrl('/', false);
  return today;
}
