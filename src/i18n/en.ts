/*
  i18next documentation: https://www.i18next.com/translation-function/essentials
  Quicktips:
    Interpolation: {{value}} will be replaced with the value of the key "value" in the interpolation object
    Plurals: Use the key "count" in the interpolation object to determine the plural form
    Nesting: $t(key) will be replaced with the translation of the key "key"
      - Nesting with interpolation: $t(key, { "value": "value" }) will replace {{value}} in the translation of "key" with "value"
      - Can be use inconjunction with interpolation: $t(key, { "value": "{{value}}" })
    Components: <key>content</key> will be replaced with the component "key" with the content "content"
      - key can be number or string but only string are used in this app for easier reference
      - More info: https://react.i18next.com/latest/trans-component
*/
const en = {
  application: {
    'headerDateTimeIndicator': 'Now in Sky',
    'settings.title': 'Settings',
    'settings.theme.title': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.system': 'System',
    'settings.theme.dark': 'Dark',
    'settings.clockFmt.title': 'Time format',
    'settings.clockFmt.twelve': '12-hour',
    'settings.clockFmt.system': 'System',
    'settings.clockFmt.twentyFour': '24-hour',
    'settings.timezones.title': 'Timezone',
    'settings.timezones.reset': 'Reset',
    'settings.fontSize.title': 'Content font size',
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
    translators: [] satisfies string[] as string[],
  },
  durationUnits: {
    'seconds.long_one': 'second',
    'seconds.long_other': 'seconds',
    'seconds.short_one': 'sec',
    'seconds.short_other': 'secs',
    'minutes.long_one': 'minute',
    'minutes.long_other': 'minutes',
    'minutes.short_one': 'min',
    'minutes.short_other': 'mins',
    'hours.long_one': 'hour',
    'hours.long_other': 'hours',
    'hours.short_one': 'hr',
    'hours.short_other': 'hrs',
    'days.long_one': 'day',
    'days.long_other': 'days',
    'days.short_one': 'd',
    'days.short_other': 'ds',
  },
  durationFmts: {
    // Use by Luxon's toFormat() function
    // https://moment.github.io/luxon/api-docs/index.html#durationtoformat
    // Wrap in single quotes (') to prevent Luxon from interpreting them as format tokens
    hm: "hh'h' mm'm'",
    hms: "hh'h' mm'm' ss's'",
    ms: "mm'm' ss's'",
  },
  skyRealms: {
    'prairie.long': 'Daylight Prairie',
    'prairie.short': 'Prairie',
    'forest.long': 'Hidden Forest',
    'forest.short': 'Forest',
    'valley.long': 'Valley of Triumph',
    'valley.short': 'Valley',
    'wasteland.long': 'Golden Wasteland',
    'wasteland.short': 'Wasteland',
    'vault.long': 'Vault of Knowledge',
    'vault.short': 'Vault',
  },
  skyMaps: {
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
  shard: {
    'rewards.ascendedCandle': 'Ascended Candle',
    'rewards.candleCake': 'Candle Cake',
    // Colors
    'color.black': 'Black Shard',
    'color.red': 'Red Shard',
    // Ordinals
    'ordinal.0': 'First shard',
    'ordinal.1': 'Second shard',
    'ordinal.2': 'Last shard',
  },
  shardCarousel: {
    'navigation.rightwards': 'Swipe right or Click here for previous shard',
    'navigation.leftwards': 'Swipe left or Click here for next shard',
    'dynamicTitle.noShard': 'No shard eruptions {{date}}',
    'dynamicTitle.hasShard': '$t(shard:color.{{color}}) in $t(skyMaps:{{map}}) on {{date}}',
  },
  shardSummary: {
    // <shard/> will be replaced with the shard type
    // <location/> will be replaced with the shard location
    // <date/> will be replaced with the shard
    'info.noShard': 'No shard eruptions <date/>',
    'info.hasShard': '<shard/> in <location/>, <date/>',
    'info.location': '$t(skyMaps:{{map}}), $t(skyRealms:{{realm}}.{{len}})',

    'info.blackShardRewards': 'Giving 4 <emoji/> of wax',
    'info.redShardRewards': 'Giving max of {{qty}} <emoji/>',

    'countdown.landing': '$t(shard:ordinal.{{i}}) landing in',
    'countdown.landed': '$t(shard:ordinal.{{i}}) landed. Ending in',
    'countdown.allEnded': 'All shards ended',
    'countdown.yourTime': 'Your time:',
    'countdown.skyTime': 'Sky time:',
    'navigation.downwards': 'Click here or Scroll down for more info',
  },
};

export default en;
export type Translation = typeof en;
