import { DateTime, Duration } from 'luxon';

const earlySkyOffset = Duration.fromObject({ minutes: -32, seconds: -10 }); //after start
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
  defRewardAC?: number;
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
    defRewardAC: 2,
  },
  {
    noShardWkDay: [2, 3], //Tue;Wed
    interval: redShardInterval,
    offset: Duration.fromObject({
      hours: 2,
      minutes: 20,
    }),
    maps: ['Bird Nest', 'Treehouse', 'Village of Dreams', 'Crabfield', 'Jellyfish Cove'],
    defRewardAC: 2.5,
  },
  {
    noShardWkDay: [3, 4], //Wed;Thu
    interval: redShardInterval,
    offset: Duration.fromObject({
      hours: 3,
      minutes: 30,
    }),
    maps: ['Sanctuary Island', 'Elevated Clearing', 'Hermit valley', 'Forgotten Ark', 'Jellyfish Cove'],
    defRewardAC: 3.5,
  },
];

const overrideRewardAC: Record<string, number> = {
  'Forest Garden': 2.5,
  'Village of Dreams': 2.5,
  'Treehouse': 3.5,
  'Jellyfish Cove': 3.5,
};

export function getShardInfo(date: DateTime): ShardInfo {
  date = date.setZone('America/Los_Angeles').startOf('day');
  const [dayOfMth, dayOfWk] = [date.day, date.weekday];
  const isRed = dayOfMth % 2 === 1;
  const realmIdx = (dayOfMth - 1) % 5;
  const infoIndex = isRed ? (((dayOfMth - 1) / 2) % 3) + 2 : (dayOfMth / 2) % 2;
  const { noShardWkDay, interval, offset, maps, defRewardAC } = shardsInfo[infoIndex];
  const haveShard = !noShardWkDay.includes(dayOfWk);
  const map = maps[realmIdx];
  const rewardAC = isRed ? overrideRewardAC[map] ?? defRewardAC : undefined;
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
    map,
    rewardAC,
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
  rewardAC?: number;
};

export interface ShardSimplePhases {
  start: DateTime;
  land: DateTime;
  end: DateTime;
}
//Shards happens 3 times a day, given any time, return the current/next shard phase
export function getUpcommingShardPhase(
  now: DateTime,
  info?: ShardInfo,
): (ShardSimplePhases & { index: number }) | undefined {
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
  eruption: DateTime;
}

export function getAllShardFullPhases(now: DateTime, info?: ShardInfo): ShardFullPhases[] {
  const today = now.setZone('America/Los_Angeles').startOf('day');
  if (!info) {
    info = getShardInfo(now);
  }
  const { offset, interval } = info;
  return Array.from({ length: 3 }, (_, i) => {
    const start = today.plus(offset).plus(interval.mapUnits(x => x * i));
    const earlySky = start.plus(earlySkyOffset);
    const eruption = start.plus(eruptionOffset);
    const land = start.plus(landOffset);
    const end = start.plus(endOffset);
    return { start, earlySky, eruption, land, end };
  });
}

interface findShardOptions {
  only?: undefined | 'black' | 'red';
}

export function findNextShard(from: DateTime, opts: findShardOptions = {}): ShardInfo {
  const info = getShardInfo(from);
  const { haveShard, isRed, lastEnd } = info;
  const { only } = opts;
  if (haveShard && from < lastEnd && (!only || (only === 'red') === isRed)) {
    return info;
  } else {
    return findNextShard(from.plus({ days: 1 }), { only });
  }
}
