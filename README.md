# Sky Shard Web Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/3287f068-3f32-4f94-9749-ee6c668bfeec/deploy-status?branch=production) Open App](https://sky-shard.netlify.app/)

## Description

Compute the color, time and location of [Shard Eruptions](https://sky-children-of-the-light.fandom.com/wiki/Shard_Eruptions) in the Game "Sky: Children of the Light".

Shard is computed as described in [Shard Prediction Rule](./ShardPredictionRule.md)

## Features

- [x] Compute the color, time and location of Shard Eruptions for any date
  - [x] Countdown to the next Shard landing or ending
  - [x] Display the landing time of the Shard Eruption in your local time zone and the time zone of Sky
  - [x] Swipe left/right to change the date
  - [ ] Swipe up/down to view more information
  - [ ] Date Selector
  - [ ] Show possible landing spots on a map (WIP)
  - [ ] Notify you when a Shard is about to land (WIP)
- [x] Dark/Light Mode & 24h/12h Time Format
- [x] Installable Progressive Web App
  - [x] Offline Support (WIP)
- [ ] Live overriding of the Shard Eruption time (WIP)
- [ ] Server Side Rendering (WIP)
  - Dynamic Meta Tags (WIP)
  - Dynamic Soical Cards Image (WIP)
  - Incremental Static Generation with Netlify (WIP)
  - Pre-rendered pages for 2 weeks in advance (WIP)

## Routes

- `/` - Today's Shard Eruption page
- `/date/:year/:month/:day` - Shard Eruption page for a specific date, For example:
  - `/date/2022/12/31` Shard Eruption page for 31st December 2022
- `/diff/:days` - Shard Eruption page for a date relative to today, For example:
  - `/diff/1` Shard Eruption page for tomorrow
  - `/diff/-5` Shard Eruption page for 5 days ago
- `/*/:section`: Shard Eruption detailed section page (summary,full,variation,steps), For example:
  - `/2022/12/31/summary` Shard Eruption summary page for 31st December 2022
  - `/diff/-5/full` Shard Eruption full schedule page for 31st December 2022

## Developement

This project uses Yarn (Berry) Package Manager with "zero-installs" 

```bash
yarn
yarn dev
```

To build the project

```bash
yarn build
```

Optionally, you can preview the production build locally

```bash
yarn preview
```
