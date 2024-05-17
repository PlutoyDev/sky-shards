# Sky Shard Web Application

[Open App](https://sky-shards.pages.dev)

## Description

Compute the color, time and location of [Shard Eruptions](https://sky-children-of-the-light.fandom.com/wiki/Shard_Eruptions) in the Game "Sky: Children of the Light".

Shard is computed as described in [Shard Prediction Rule](./ShardPredictionRule.md) and calculated [here](./src/data/shard.ts)

## Localizations

Google sheet link: [Sky Shard Translation](https://docs.google.com/spreadsheets/d/16eSANTI310SY8uWjsjbxNBzyD-49hwF3OGYRkFPykoo/edit)

Languages will be downloaded into `src/i18n/locales` from Google Sheets when the app is built.
Do not edit the files in `src/i18n/locales` directly.

The langauge names `src/i18n/codeLangs.json` is committed to the repository and will also be updated when the app is built. Ignore all the changes to this file:

```bash
git update-index --assume-unchanged src/i18n/codeLangs.json
```

## Routes

Processed by [Setting Context](./src/context/Settings.tsx)

- `/` - Today's Shard Eruption page
- `/:lang` - Translation
  - Available languages are in [Google Sheet](https://docs.google.com/spreadsheets/d/16eSANTI310SY8uWjsjbxNBzyD-49hwF3OGYRkFPykoo/edit#gid=2102926823)
- Relative day
  - `/:lang/tomorrow` or `/tmr` - Tomorrow's Shard Eruption page
  - `/:lang/yesterday` or `/ytd` - Yesterday's Shard Eruption page
- `/:lang/:year/:month/:day` - Shard Eruption page for a specific date, For example:
  - `/:lang/2022/12/31` Shard Eruption page for 31st December 2022
  - `/:lang/2023/1/1` Shard Eruption page for 1st January 2023

### Query Parameters

- `gsTrans` - Fetch Google Sheet Translation (`1`|`0`)
- `twelveHour` - Display time in 12-hour format (`true` | `false` | `system` )
- `lightMode` - Light mode (`true` | `false` | `system`)
- `timezone` - Timezone [IANA Timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (`string`)
- `fontSize` - Font size (1 decimal point) (`number`)
- `numCols` - Number of columns in the table in date selector (`number`)

## Development

Requirements:

- [Node.js](https://nodejs.org/en/) >= 18
- [pnpm](https://pnpm.io/) >= 8

### Commands

Enable Corepack for pnpm

```bash
corepack enable
```

Install dependencies

```bash
pnpm install
```

Run the development server

```bash
pnpm dev
```

Build the project

```bash
pnpm build
```

## Feedback & Issues

Feel free to open an issue or pull request for any feedback or issues. No need to be formal, just let me know what you think. I will try to respond as soon as possible.

## License

TL;DR: You can do whatever you want with the code. A link back to this repository or website would be appreciated.

> [!IMPORTANT]  
> Assets located in `/public/infographics/*`, `/public/ext/*` & `/public/emojis/*` are not covered by this license as they are not created by me.

[MIT](./LICENSE)
