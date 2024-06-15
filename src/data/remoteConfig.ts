// Copied from https://github.com/PlutoyDev/sky-shardfig/blob/main/shared/lib.ts
import { DateTime } from 'luxon';
import useSWR from 'swr';
import type { Translation } from '../i18n';

export interface Override {
  hasShard?: boolean;
  isRed?: boolean;
  group?: number;
  realm?: number;
  map?: keyof Translation['skyMaps'];
}

export interface DailyConfig {
  memory?: 0 | 1 | 2 | 3 | 4 | 5 | null;
  memoryBy?: string | null;
  variation?: 0 | 1 | 2 | 3 | null;
  variationBy?: string | null;
  override?: Override | null;
  overrideBy?: string | null;
  overrideReason?: string | null;
  version?: number;
  lastModified?: DateTime;
}

export interface RemoteConfigResponse {
  dailiesMap: Record<string, DailyConfig>;
  authorNames: Record<string, string>;
  warning?: 'bugged' | 'changed' | 'disabled';
  warningLink?: string;
  // Randomly generated string for polling check
  id: string;
}

export type RemoteConfig = RemoteConfigResponse;

// export async function fetchRemoteConfigSample(): Promise<RemoteConfig> {
//   const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/minified.json');
//   return await res.json();
// }

// export async function fetchRemoteConfigFull(): Promise<RemoteConfig> {
//   const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/all.json');
//   return await res.json();
// }

// export async function shouldUpdate(id: string): Promise<boolean> {
//   const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/poll_id.txt');
//   const text = await res.text();
//   return text !== id;
// }

const fetcher = (file: 'minified.json' | 'all.json') =>
  fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/' + file).then(res =>
    res.json(),
  ) as Promise<RemoteConfig>;

export function useRemoteConfig(requireFull: boolean = false) {
  const { data: config } = useSWR(() => (requireFull ? 'all.json' : 'minified.json'), fetcher, {
    refreshInterval: 20 * 60 * 1000, // 20 minutes
    keepPreviousData: true,
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
    focusThrottleInterval: 5 * 60 * 1000, // 5 minutes
  });

  return config;
}
