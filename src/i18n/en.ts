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
      prairie_long: 'Daylight Prairie',
      prairie_short: 'Prairie',
      forest_long: 'Hidden Forest',
      forest_short: 'Forest',
      valley_long: 'Valley of Triumph',
      valley_short: 'Valley',
      wasteland_long: 'Golden Wasteland',
      wasteland_short: 'Wasteland',
      vault_long: 'Vault of Knowledge',
      vault_short: 'Vault',
    },
    areas: {
      prairie: {
        butterfly: 'Butterfly Fields',
        village: 'Village Islands',
        cave: 'Cave',
        bird: 'Bird Nest',
        island: 'Sanctuary Island',
      },
      forest: {
        brook: 'Brook',
        boneyard: 'Boneyard',
        end: 'Forest Garden',
        tree: 'Treehouse',
        sunny: 'Elevated Clearing',
      },
      valley: {
        rink: 'Ice Rink',
        dreams: 'Village of Dreams',
        hermit: 'Hermit valley',
      },
      wasteland: {
        temple: 'Broken Temple',
        battlefield: 'Battlefield',
        graveyard: 'Graveyard',
        crab: 'Crab Field',
        ark: 'Forgotten Ark',
      },
      vault: {
        starlight: 'Starlight Desert',
        jelly: 'Jellyfish Cove',
      },
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
