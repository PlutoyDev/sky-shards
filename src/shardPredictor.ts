import { DateTime, Duration } from 'luxon';

const earlyOffset = Duration.fromObject({ minutes: -30 }); //after start
const eruptionOffset = Duration.fromObject({ minutes: 7 }); //after start
const landOffset = Duration.fromObject({ minutes: 8, seconds: 40 }); //after start
const endOffset = Duration.fromObject({ hours: 4 }); //after start

const blackShardInterval = Duration.fromObject({ hours: 8 });
const redShardInterval = Duration.fromObject({ hours: 6 });

const realmsFull = ['Daylight Prairie', 'Hidden Forest', 'Valley Of Triumph', 'Golden Wasteland', 'Vault Of Knowledge'];
const realmsNick = ['Prairie', 'Forest', 'Valley', 'Wasteland', 'Vault'];

interface ShardConfig {
  noShardWkDay: number[];
  offset: Duration;
  interval: Duration;
  maps: [string, string, string, string, string];
}

const shardsInfo: ShardConfig[] = [
  {
    noShardWkDay: [6, 7], //Sat;Sun
    interval: blackShardInterval,
    offset: Duration.fromObject({
      hours: 1,
      minutes: 50,
    }),
    maps: ['Butterfly Field', 'Forest Brook', 'Ice Rink', 'Broken Temple', 'Starlight Desert'],
  },
  {
    noShardWkDay: [7, 1], //Sun;Mon
    interval: blackShardInterval,
    offset: Duration.fromObject({
      hours: 2,
      minutes: 10,
    }),
    maps: ['Village Islands', 'Boneyard', 'Ice Rink', 'Battlefield', 'Starlight Desert'],
  },
  {
    noShardWkDay: [1, 2], //Mon;Tue
    interval: redShardInterval,
    offset: Duration.fromObject({
      hours: 7,
      minutes: 40,
    }),
    maps: ['Cave', 'Forest Garden', 'Village of Dreams', 'Graveyard', 'Jellyfish Cove'],
  },
  {
    noShardWkDay: [2, 3], //Tue;Wed
    interval: redShardInterval,
    offset: Duration.fromObject({
      hours: 2,
      minutes: 20,
    }),
    maps: ['Bird Nest', 'Treehouse', 'Village of Dreams', 'Crabfield', 'Jellyfish Cove'],
  },
  {
    noShardWkDay: [3, 4], //Wed;Thu
    interval: redShardInterval,
    offset: Duration.fromObject({
      hours: 3,
      minutes: 30,
    }),
    maps: ['Sanctuary Island', 'Elevated Clearing', 'Hermit valley', 'Forgotten Ark', 'Jellyfish Cove'],
  },
];

export function getShardInfo(date: DateTime): ShardInfo {
  date = date.setZone('America/Los_Angeles').startOf('day');
  const [dayOfMth, dayOfWk] = [date.day, date.weekday];
  const isRed = dayOfMth % 2 === 1;
  const realmIdx = (dayOfMth - 1) % 5;
  const infoIndex = isRed ? (((dayOfMth - 1) / 2) % 3) + 2 : (dayOfMth / 2) % 2;
  const { noShardWkDay, interval, offset, maps } = shardsInfo[infoIndex];
  const haveShard = !noShardWkDay.includes(dayOfWk);
  return {
    date,
    isRed,
    haveShard,
    offset,
    interval,
    realmFull: realmsFull[realmIdx],
    realmNick: realmsNick[realmIdx],
    map: maps[realmIdx],
  };
}

export type ShardInfo = {
  date: DateTime;
  isRed: boolean;
  haveShard: boolean;
  offset: Duration;
  interval: Duration;
  realmFull: string;
  realmNick: string;
  map: string;
};

export interface ShardPhases {
  early: DateTime;
  start: DateTime;
  eruption: DateTime;
  land: DateTime;
  end: DateTime;
}

export function phasesFromStart(start: DateTime): ShardPhases {
  const early = start.plus(earlyOffset);
  const end = start.plus(endOffset);
  const eruption = start.plus(eruptionOffset);
  const land = start.plus(landOffset);
  return { early, start, eruption, land, end };
}

export function phasesFromEnd(end: DateTime): ShardPhases {
  const start = end.minus(endOffset);
  const early = start.plus(earlyOffset);
  const eruption = start.plus(eruptionOffset);
  const land = start.plus(landOffset);
  return { early, start, eruption, land, end };
}

interface RecursiveOpt {
  limit?: number;
  daysAdded?: number;
  colorIsRed?: boolean;
}

export function nextShardInfo(
  now: DateTime,
  recursive: RecursiveOpt = {},
): { info: ShardInfo; daysAdded: number; date: DateTime } {
  const { limit = 14, daysAdded = 0, colorIsRed } = recursive;
  const info = getShardInfo(now);
  const { haveShard, isRed } = info;
  if (haveShard && (colorIsRed === undefined || colorIsRed === isRed)) {
    return { info, daysAdded, date: now };
  }
  if (daysAdded >= limit) {
    return { info, daysAdded, date: now };
  }
  return nextShardInfo(now.plus({ days: 1 }), { limit, daysAdded: daysAdded + 1, colorIsRed });
}

export function nextOrCurrent(
  now: DateTime,
  recursive = false,
  daysAdded = 0,
): { info: ShardInfo; index?: number; phases?: ShardPhases; daysAdded: number } {
  const today = now.startOf('day');
  const info = getShardInfo(now);
  const { haveShard, offset, interval } = info;
  if (!haveShard) {
    if (recursive) {
      return nextOrCurrent(today.plus({ days: 1 }), recursive, daysAdded + 1);
    }
    return { info, daysAdded };
  }

  const firstEnd = today.plus(offset).plus(endOffset);
  const ends = Array.from({ length: 3 }, (_, i) => firstEnd.plus(interval.mapUnits(v => v * i)));
  const index = ends.findIndex(end => now < end);
  const next = ends[index];

  if (next) {
    const phases = phasesFromEnd(next);
    return { info, index, phases, daysAdded };
  }

  if (recursive) {
    return nextOrCurrent(today.plus({ days: 1 }), recursive, daysAdded + 1);
  }

  return { info, daysAdded };
}
