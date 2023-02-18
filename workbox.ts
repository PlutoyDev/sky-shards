import { GenerateSWOptions } from 'workbox-build';

export const workbox: Partial<GenerateSWOptions> = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};

if (process.env.NETLIFY_IMAGES_CDN_DOMAIN) {
  workbox.runtimeCaching.push({
    urlPattern: new RegExp(`^https://${process.env.NETLIFY_IMAGES_CDN_DOMAIN.replace(/\./g, '\\.')}/.*`, 'i'),
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'netlify-cdn',
      backgroundSync: {
        name: 'netlify-cdn-queue',
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  });
}

export default workbox;
