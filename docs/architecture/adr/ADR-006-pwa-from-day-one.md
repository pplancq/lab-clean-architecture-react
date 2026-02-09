## ADR-006: PWA from Day One

**Date:** 2026-01-14  
**Status:** ✅ Accepted

### Context

The application requires offline functionality for game collection management. Users should be able to:

- Browse their collection without internet
- Add/edit games offline (sync when online)
- Install the app on mobile/desktop for native-like experience

**Requirements:**

- Offline-first architecture (IndexedDB + Service Worker)
- App shell caching (HTML, CSS, JS files)
- Network-first for API calls (IGDB metadata)
- Installable on mobile/desktop (PWA manifest)

**Alternatives Considered:**

- **No PWA (Online-Only)**: ❌ Requires internet, poor mobile experience
- **PWA Post-MVP**: ❌ Harder to retrofit Service Worker logic later
- **PWA from Day One**: ✅ Architecture designed for offline from the start

### Decision

Implement **Progressive Web App (PWA)** from the initial setup using Rsbuild PWA Plugin.

**Implementation:**

**Rsbuild Configuration:**

```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginPWA } from '@rsbuild/plugin-pwa';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginPWA({
      manifest: {
        name: 'Game Collection Manager',
        short_name: 'GameCollection',
        description: 'Manage your video game collection offline',
        theme_color: '#1a1a2e',
        background_color: '#16213e',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache-first for app shell (HTML, CSS, JS)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.igdb\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'igdb-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Manifest File:**

```json
{
  "name": "Game Collection Manager",
  "short_name": "GameCollection",
  "description": "Offline-first game collection management",
  "theme_color": "#1a1a2e",
  "background_color": "#16213e",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Caching Strategy:**

- **App Shell (HTML, CSS, JS)**: Cache-First with automatic updates on new deployment
- **IGDB API Metadata**: Network-First with 30-day fallback cache
- **User Data (IndexedDB)**: No Service Worker caching (direct IndexedDB access)

**Offline Detection:**

```typescript
// shared/infrastructure/network/NetworkStatus.ts
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Usage in UI
const CollectionPage = () => {
  const isOnline = useNetworkStatus();

  return (
    <>
      {!isOnline && <OfflineBanner />}
      {/* ... */}
    </>
  );
};
```

### Consequences

**Positive:**

- ✅ **Offline-First**: Full CRUD operations without network (IndexedDB + Service Worker)
- ✅ **Performance**: Instant page loads (cached app shell)
- ✅ **Mobile Experience**: Installable on home screen, native-like feel
- ✅ **Resilience**: App works even with poor network connection
- ✅ **Educational Value**: Demonstrates modern PWA patterns

**Negative:**

- ❌ **Cache Management**: Service Worker lifecycle can be confusing (update strategies)
- ❌ **Storage Quotas**: PWA storage subject to browser eviction policies
- ❌ **Debugging Complexity**: Service Worker bugs harder to debug than regular JS
- ❌ **HTTPS Requirement**: Cannot test PWA features on `http://` (mitigated by localhost exception)
