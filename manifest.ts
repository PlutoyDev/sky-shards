import { ManifestOptions } from 'vite-plugin-pwa';

const shortcutsIcon = [
  {
    src: '/icons/icon-72x72.png',
    sizes: '72x72',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-96x96.png',
    sizes: '96x96',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-128x128.png',
    sizes: '128x128',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-144x144.png',
    sizes: '144x144',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-152x152.png',
    sizes: '152x152',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-384x384.png',
    sizes: '384x384',
    type: 'image/png',
    purpose: 'maskable any',
  },
  {
    src: '/icons/icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable any',
  },
];

const manifest: Partial<ManifestOptions> = {
  name: 'Sky Shards',
  short_name: 'Sky Shards',
  description: `Shard Eruption in the game 'Sky: Children of the Light'`,
  theme_color: '#8a76b1',
  background_color: '#8a76b1',
  display: 'standalone',
  shortcuts: [
    {
      name: 'Next Shard',
      short_name: 'Next Shard',
      url: '/next',
      icons: shortcutsIcon,
    },
    {
      name: 'Next Red Shard',
      short_name: 'Next Red Shard',
      url: '/next/red',
      icons: shortcutsIcon,
    },
    {
      name: 'Next Black Shard',
      short_name: 'Next Black Shard',
      url: '/next/black',
      icons: shortcutsIcon,
    },
  ],
  icons: [
    {
      src: 'favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon',
    },
    {
      src: '/icons/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icons/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any',
    },
  ],
};

export default manifest;
