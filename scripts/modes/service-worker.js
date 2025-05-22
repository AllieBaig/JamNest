

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false });

  workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: null },
    { url: 'styles/main.css', revision: null },
    { url: 'scripts/main.js', revision: null },
    // add other static files as needed
  ]);

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'audio',
    new workbox.strategies.CacheFirst()
  );
}

