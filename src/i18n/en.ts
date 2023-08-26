export const en = {
  application: {
    headerDateTimeIndicator: 'Now in Sky',
    settings: {
      title: 'Settings',
      theme: {
        title: 'Theme',
        light: 'Light',
        system: 'System',
        dark: 'Dark',
      },
      clockFmt: {
        title: 'Time format',
        twelve: '12-hour',
        system: 'System',
        twentyFour: '24-hour',
      },
      timezones: {
        title: 'Timezone',
        reset: 'Reset',
      },
      fontSize: {
        title: 'Content font size',
      },
    },
    about: {
      createdBy: 'Created by: {{author}}',
      version: 'Version: {{version}}',
      credits: 'Thanks to these Discord users for aiding in discovering shard eruption patterns:',
      githubSourceLong: 'Source on GitHub',
      githubSourceShort: 'GitHub',
      feedbackLong: 'Submit Feedback',
      feedbackShort: 'Feedback',
      translatedBy: 'Translated by: {{translator}}',
      // Please remember to add yourself to the list if you translate this app for this language. Thanks!
      translators: [],
    },
    navigation: {
      rightwards: 'Swipe right or Click here for previous shard',
      leftwards: 'Swipe left or Click here for next shard',
      downwards: 'Click here or Scroll down for more info',
    },
  },
  durationUnits: {
    seconds: {
      long_one: 'second',
      long_other: 'seconds',
      short_one: 'sec',
      short_other: 'secs',
      narrow_one: 's',
      narrow_other: 's',
    },
    minutes: {
      long_one: 'minute',
      long_other: 'minutes',
      short_one: 'min',
      short_other: 'mins',
      narrow_one: 'm',
      narrow_other: 'm',
    },
    hours: {
      long_one: 'hour',
      long_other: 'hours',
      short_one: 'hr',
      short_other: 'hrs',
      narrow_one: 'h',
      narrow_other: 'h',
    },
    days: {
      long_one: 'day',
      long_other: 'days',
      short_one: 'day',
      short_other: 'days',
      narrow_one: 'd',
      narrow_other: 'd',
    },
  },
  sky: {
    realms: {
      prairie: {
        long: 'Daylight Prairie',
        short: 'Prairie',
      },
      forest: {
        long: 'Hidden Forest',
        short: 'Forest',
      },
      valley: {
        long: 'Valley of Triumph',
        short: 'Valley',
      },
      wasteland: {
        long: 'Golden Wasteland',
        short: 'Wasteland',
      },
      vault: {
        long: 'Vault of Knowledge',
        short: 'Vault',
      },
    },
    areas: {
      'prairie.butterfly': 'Butterfly Fields',
      'prairie.village': 'Village Islands',
      'prairie.cave': 'Cave',
      'prairie.bird': 'Bird Nest',
      'prairie.island': 'Sanctuary Island',
      'forest.brook': 'Brook',
      'forest.boneyard': 'Boneyard',
      'forest.end': 'Forest Garden',
      'forest.tree': 'Treehouse',
      'forest.sunny': 'Elevated Clearing',
      'valley.rink': 'Ice Rink',
      'valley.dreams': 'Village of Dreams',
      'valley.hermit': 'Hermit valley',
      'wasteland.temple': 'Broken Temple',
      'wasteland.battlefield': 'Battlefield',
      'wasteland.graveyard': 'Graveyard',
      'wasteland.crab': 'Crab Field',
      'wasteland.ark': 'Forgotten Ark',
      'vault.starlight': 'Starlight Desert',
      'vault.jelly': 'Jellyfish Cove',
    },
  },
  shard: {
    self: 'shard',
    color: {
      black: 'Black',
      red: 'Red',
    },
    rewards: {
      ascendedCandle: 'Ascended Candle',
      candleCake: 'Candle Cake',
      maxOf: 'max of',
      sentenceRed: 'Giving {{shard.reward.maxOf}} {{count}} {{- emoji}}',
      sentenceBlack: 'Giving {{count}} {{- emoji}} of wax',
    },
    verb: {
      landing: 'Landing in',
      landed: 'Landed',
      ending: 'Ending in',
      ended: 'Ended',
    },
    ordinal: ['first {{shard.self}}', 'second {{shard.self}}', 'last {{shard.self}}'],
  },
} as const;

export default en;
export type Translation = typeof en;
