const cacheName = "iconx-cache-v1";

const filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/browserconfig.xml",
  "/sw.js",
  "/styles/index.css",
  "/styles/fonts.css",
  "/styles/reset.css",
  "/styles/tokens.css",
  "/styles/utilities.css",
  "/javascript/script.js",
  "/public/fonts/Lilex.woff2",
  "/public/fonts/Lilex-Italic.woff2",
  "/public/icons/apple-touch-icon-x120.png",
  "/public/icons/apple-touch-icon-x180.png",
  "/public/icons/apple-touch-icon-x76.png",
  "/public/icons/favicon-x16.ico",
  "/public/icons/favicon-x48.ico",
  "/public/icons/icon-x16.png",
  "/public/icons/icon-x32.png",
  "/public/icons/icon-x48.png",
  "/public/icons/icon-x64.png",
  "/public/icons/icon-x96.png",
  "/public/icons/logo-x192-1.png",
  "/public/icons/logo-x192.png",
  "/public/icons/msapplication-TileImage-x144.png",
  "/public/icons/safari-pinned-tab.svg",
  "/public/icons/splash-x512-1.png",
  "/public/icons/splash-x512.png",
  "/public/images/og-image.png",
  "/public/images/screenshots-desktop.png",
  "/public/images/screenshots-mobile.png",
];

async function handleInstall() {
  try {
    const cache = await caches.open(cacheName);

    await Promise.all(
      filesToCache.map(async (file) => {
        try {
          await cache.add(file);
          console.log("Cached:", file);
        } catch (err) {
          console.error("Failed to cache:", file, err);
        }
      }),
    );

    console.log("Service Worker installed");
    await self.skipWaiting();
  } catch (error) {
    console.error("Install event failed:", error);
  }
}

async function handleFetch(event) {
  try {
    const response = await caches.match(event.request);
    console.log("Fetch event handled for:", event.request.url);
    return response || fetch(event.request);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetch event failed:", error.message);
    } else {
      console.error("Fetch event failed:", error);
    }
    return new Response("Network error", { status: 408 }); // Fallback response
  }
}

async function handleActivate() {
  try {
    const cacheNames = await caches.keys();
    console.log("Activating service worker with cache names:", cacheNames);

    await Promise.all(
      cacheNames.map((name) => {
        if (name !== cacheName) {
          return caches.delete(name);
        }
      }),
    );

    await self.clients.claim(); // Take control of existing clients
  } catch (error) {
    if (error instanceof Error) {
      console.error("Activate event failed:", error.message);
    } else {
      console.error("Activate event failed:", error);
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(handleInstall());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(handleActivate());
});
