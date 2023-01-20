import { DateTime, Duration } from 'luxon';

const earlySkyOffset = Duration.fromObject({ minutes: -30 }); //after start
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
  const lastEnd = date
    .plus(offset)
    .plus(interval.mapUnits(x => x * 2))
    .plus(endOffset);
  return {
    date,
    isRed,
    haveShard,
    offset,
    interval,
    lastEnd,
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
  lastEnd: DateTime;
  realmFull: string;
  realmNick: string;
  map: string;
};

export interface ShardSimplePhases {
  index: number;
  start: DateTime;
  land: DateTime;
  end: DateTime;
}
//Shards happens 3 times a day, given any time, return the current/next shard phase
export function getUpcommingShardPhase(now: DateTime, info?: ShardInfo): ShardSimplePhases | undefined {
  if (!info) {
    info = getShardInfo(now);
  }
  const { interval, lastEnd } = info;
  if (now > lastEnd) return undefined;
  const secondEnd = lastEnd.minus(interval);
  if (now > secondEnd) {
    const start = lastEnd.minus(endOffset);
    return { index: 2, start, land: start.plus(landOffset), end: lastEnd };
  }
  const firstEnd = secondEnd.minus(interval);
  if (now > firstEnd) {
    const start = secondEnd.minus(endOffset);
    return { index: 1, start, land: start.plus(landOffset), end: secondEnd };
  }
  const start = firstEnd.minus(endOffset);
  return { index: 0, start, land: start.plus(landOffset), end: firstEnd };
}

export interface ShardFullPhases extends ShardSimplePhases {
  earlySky: DateTime;
  start: DateTime;
  eruption: DateTime;
}
