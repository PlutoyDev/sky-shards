import { DateTime } from 'luxon';
import { findNextShard } from './shardPredictor';

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

interface SkyShardUrl {
  date: DateTime;
  gsTrans: boolean;
  lang?: string;
}

export function parseUrl(url: URL): SkyShardUrl {
  const today = DateTime.local().setZone('America/Los_Angeles').startOf('day');
  const path = url.pathname;
  const urlParams = new URLSearchParams(url.search);
  const gsTrans = urlParams.get('gsTrans') === '1';
  const lang = urlParams.get('lang') || undefined;
  if (path === '/') return { date: today, gsTrans, lang };
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
          return {
            date: DateTime.local(2022, 10, 1, { zone: appZone }),
            gsTrans,
            lang,
          };
        } else if (!DateTime.local({ zone: appZone }).hasSame(date, 'day')) {
          return { date, gsTrans, lang };
        }
      }
    }
  } else if (Object.keys(relDateMap).includes(route)) {
    const offset = relDateMap[route as keyof typeof relDateMap];
    const date = today.plus({ days: offset });
    return { date, gsTrans, lang };
  } else if (route === 'next') {
    const today = DateTime.local().setZone('America/Los_Angeles');
    const color = params[0] as 'red' | 'black' | undefined;
    const date = findNextShard(today, color && { only: color }).date;
    return { date, gsTrans, lang };
  }
  return { date: today, gsTrans, lang };
}
