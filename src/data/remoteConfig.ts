// Copied from https://github.com/PlutoyDev/sky-shardfig/blob/main/shared/lib.ts

export interface ManualData {
  memory?: 0 | 1 | 2 | 3 | 4 | 5;
  variation?: number;
  isBugged?: boolean;
  bugType?: 'noShard' | 'noMemory';
  isDisabled?: boolean;
  disabledReason?: string;
  credits?: string[];
  lastModified?: string;
  lastModifiedBy?: string;
}

export interface RemoteConfig {
  dailyMap: Record<string, ManualData>; //key = yyyy-mm-dd
  isBugged?: boolean;
  bugType?: 'inaccurate' | 'tgc :/';
  lastModified?: string;
  lastModifiedBy?: string;
}

export async function fetchRemoteConfig(): Promise<RemoteConfig> {
  const res = await fetch(import.meta.env.VITE_SHARD_REMOTE_URL as string);
  return await res.json();
}
