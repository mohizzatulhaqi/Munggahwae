/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import { CacheFirst, ExpirationPlugin, NetworkFirst, Serwist } from 'serwist';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const runtimeCaching: RuntimeCaching[] = [
  {
    matcher: ({ url }) => url.hostname.endsWith('tile.opentopomap.org'),
    handler: new CacheFirst({
      cacheName: 'opentopomap-tiles',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
  {
    matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname === '/api/image-proxy',
    handler: new CacheFirst({
      cacheName: 'mountain-photos',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 90 * 24 * 60 * 60,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
  {
    matcher: ({ url }) => url.hostname === 'api.open-meteo.com',
    handler: new NetworkFirst({
      cacheName: 'open-meteo-forecast',
      networkTimeoutSeconds: 8,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 6 * 60 * 60,
          maxAgeFrom: 'last-used',
        }),
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
