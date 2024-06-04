// Copied from https://github.com/PlutoyDev/sky-shardfig/blob/main/shared/lib.ts
import { DateTime } from 'luxon';
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
  warnings?: 'bugged' | 'changed' | 'disabled';
  // Randomly generated string for polling check
  id: string;
}

export type RemoteConfig = RemoteConfigResponse;

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/minified.json');
  return await res.json();
}

export async function shouldUpdate(id: string): Promise<boolean> {
  const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/poll_id.txt');
  const text = await res.text();
  return text !== id;
}
