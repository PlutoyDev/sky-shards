# Sky Shard Web Application

[Open App](https://sky-shards.pages.dev)

## Description

Compute the color, time and location of [Shard Eruptions](https://sky-children-of-the-light.fandom.com/wiki/Shard_Eruptions) in the Game "Sky: Children of the Light".

Shard is computed as described in [Shard Prediction Rule](./ShardPredictionRule.md)

## Localizations

Google sheet link: [Sky Shard Translation](https://docs.google.com/spreadsheets/d/16eSANTI310SY8uWjsjbxNBzyD-49hwF3OGYRkFPykoo/edit)

Languages will be downloaded into `src/i18n/locales` from Google Sheets when the app is built.
Do not edit the files in `src/i18n/locales` directly.

The langauge names `src/i18n/codeLangs.json` is committed to the repository and will also be updated when the app is built. Ignore all the changes to this file:

```bash
git update-index --assume-unchanged src/i18n/codeLangs.json
```

## Routes

- `/` - Today's Shard Eruption page
- Relative day
  - `/tomorrow` - Tomorrow's Shard Eruption page
  - `/yesterday` - Yesterday's Shard Eruption page
- `/date/:year/:month/:day` - Shard Eruption page for a specific date, For example:
  - `/date/2022/12/31` Shard Eruption page for 31st December 2022
  - `/date/2023/1/1` Shard Eruption page for 1st January 2023

## Development

Requirements:

- [Node.js](https://nodejs.org/en/) >= 16
- [pnpm](https://pnpm.io/) >= 7

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
