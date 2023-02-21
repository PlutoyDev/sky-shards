# Sky Shard Web Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/3287f068-3f32-4f94-9749-ee6c668bfeec/deploy-status?branch=production) Open App](https://sky-shards.netlify.app/)

## Description

Compute the color, time and location of [Shard Eruptions](https://sky-children-of-the-light.fandom.com/wiki/Shard_Eruptions) in the Game "Sky: Children of the Light".

Shard is computed as described in [Shard Prediction Rule](./ShardPredictionRule.md)

## Features

- [x] Compute the color, time and location of Shard Eruptions for any date
  - [x] Countdown to the next Shard landing or ending
  - [x] Display the landing time of the Shard Eruption in your local time zone and the time zone of Sky
  - [x] Swipe left/right to change the date
  - [x] Scroll up/down to view more information
  - [x] Show possible landing spots on a map
  - [ ] Date Selector (WIP)
  - [ ] Notify you when a Shard is about to land
- [x] Dark/Light Mode & 24h/12h Time Format
- [x] Installable Progressive Web App
  - [x] Offline Support
- [ ] Live overriding of the Shard Eruption time
- [ ] Server Side Rendering
  - Dynamic Meta Tags
  - Dynamic Soical Cards Image
  - Incremental Static Generation with Netlify
  - Pre-rendered pages for 2 weeks in advance

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

Optional (Serverless Functions):

- [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation) >= 12

### Commands:

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
# OR with Netlify CLI
netlify dev
```

Build the project

```bash
pnpm build
# OR with Netlify CLI
netlify build
```
