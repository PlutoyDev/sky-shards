import { DateTime, Duration } from 'luxon';

const earlyOffset = Duration.fromObject({ minutes: -30 }); //after start
const eruptionOffset = Duration.fromObject({ minutes: 7 }); //after start
const landOffset = Duration.fromObject({ minutes: 1, seconds: 40 }); //after start
const endOffset = Duration.fromObject({ minutes: 1, seconds: 30 }); //after start

const blackShardInterval = Duration.fromObject({ hours: 8 });
const redShardInterval = Duration.fromObject({ hours: 6 });

// const realms = ['Daylight Prairie', 'Hidden Forest', 'Valley Of Triumph', 'Golden Wasteland', 'Vault Of Knowledge']
const realms = ['Prairie', 'Forest', 'Valley', 'Wasteland', 'Vault'];

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

export default function predict(date: DateTime) {
  date = date.setZone('America/Los_Angeles').startOf('day');
  const [dayOfMth, dayOfWk] = [date.day, date.weekday];
  const isRed = dayOfMth % 2 === 1;
  const realmIdx = (dayOfMth - 1) % 5;
  const infoIndex = isRed ? (((dayOfMth - 1) / 2) % 3) + 2 : (dayOfMth / 2) % 2;
  const { noShardWkDay, interval, offset, maps } = shardsInfo[infoIndex];
  const haveShard = !noShardWkDay.includes(dayOfWk);
  if (!haveShard) return { isRed, haveShard } as const;
  const shardStart = date.plus(offset);

  const occurrences = Array.from({ length: 3 }).map((_, i) => {
    // const start = add(shardStart, { hours: i * interval.hours });
    // const early = add(start, earlyOffset);
    // const end = add(start, endOffset);
    // const eruption = add(start, eruptionOffset);
    // const land = add(start, landOffset);
    const start = shardStart.plus(interval.mapUnits(v => v * i));
    const early = start.plus(earlyOffset);
    const end = start.plus(endOffset);
    const eruption = start.plus(eruptionOffset);
    const land = start.plus(landOffset);
    return { early, start, eruption, land, end };
  });

  return {
    isRed,
    haveShard,
    occurrences,
    realm: realms[realmIdx],
    map: maps[realmIdx],
  } as const;
}
