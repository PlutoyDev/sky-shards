// Copied from https://github.com/PlutoyDev/sky-shardfig/blob/main/shared/lib.ts
import { DateTime } from 'luxon';

export interface Override {
  hasShard?: boolean;
  isRed?: boolean;
  group?: number;
  realm?: number;
  map?: string;
}

export interface DailyConfig {
  memory?: number | null;
  memoryBy?: string | null;
  variation?: number | null;
  variationBy?: string | null;
  override?: Override | null;
  overrideBy?: string | null;
  overrideReason?: string | null;
  version?: number;
  lastModified?: DateTime;
}

export interface GlobalConfig {
  // This controls the global state of the application
  bugged?: boolean;
  buggedReason?: string;
}

export interface RemoteConfigResponse {
  dailiesMap: Record<string, DailyConfig>;
  authorNames: Record<string, string>;
  global?: GlobalConfig;
}

export type RemoteConfig = RemoteConfigResponse;

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/minified.json');
  return await res.json();
}

export async function fetchRemoteLastUpdated(): Promise<number> {
  const res = await fetch((import.meta.env.VITE_SHARD_REMOTE_URL as string) + '/last_updated.txt');
  const text = await res.text();
  return parseInt(text);
}
