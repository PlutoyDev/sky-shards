import { DateTime } from 'luxon';
import { parseUrl } from './parseUrl';
import { getShardInfo } from './shardPredictor';

// Oembed Provider

interface OembedRequestQuery {
  url: string;
}

interface OembedResponseBase {
  version: '1.0';
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: number;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

interface OembedResponsePhoto extends OembedResponseBase {
  type: 'photo';
  url: string;
  width: number;
  height: number;
}

interface OembedResponseVideo extends OembedResponseBase {
  type: 'video';
  html: string;
  width: number;
  height: number;
}

interface OembedResponseLink extends OembedResponseBase {
  type: 'link';
}

interface OembedResponseRich extends OembedResponseBase {
  type: 'rich';
  html: string;
  width: number;
  height: number;
}

export const onRequestGet: PagesFunction = ctx => {
  const { url, headers } = ctx.request;
  const urlObj = new URL(url);
  const { searchParams } = urlObj;
  const { url: encodedUrl } = searchParams as unknown as OembedRequestQuery;
  const embeddingUrl = new URL(decodeURIComponent(encodedUrl));
  const date = parseUrl(embeddingUrl).date;
  const shardInfo = getShardInfo(date);

  let message: string;

  if (shardInfo.haveShard) {
    message = `Today's shard is in ${shardInfo.realm} (${shardInfo.map})`;
  } else {
    message = `No shard today`;
  }

  // const userAgent = headers.get('user-agent');
  // const isDiscordBot = userAgent && userAgent.includes('Discordbot');

  const response: OembedResponseRich = {
    version: '1.0',
    type: 'rich',
    html: `${message}`,
    width: 200,
    height: 100,
    provider_name: 'SkyShard',
    provider_url: 'https://sky-shards.pages.dev',
  };

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
};
