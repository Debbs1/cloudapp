const CACHE_NAME = 'V1';
const STATIC_CACHE_URLS = [
  'index.html',
  'offline.html',
  'style.css',
  'index.js',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS))
  );
});

self.addEventListener('fetch', (event) => {
  //for fetch network request to api
  if (event.request.url.includes('api.openweathermap.org')) {
    // response to API requests, Cache Update Refresh strategy
    event.respondWith(caches.match(event.request));
    event.waitUntil(update(event.request).then(refresh));
  }

  // for static files Cache-First Strategy
  event.respondWith(
    caches
      .match(event.request) // check if the request has already been cached
      .then((cached) => cached || fetch(event.request)) // otherwise request network
      .then(
        (response) =>
          cache(event.request, response) // put response in cache
            .then(() => response) // resolve promise with the network response
      )
  );
});

function cache(request, response) {
  if (response.type === 'error' || response.type === 'opaque') {
    return Promise.resolve(); // do not put in cache network errors
  }

  return caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, response.clone()));
}

// self.addEventListener('fetch', (event) => {
//   if (event.request.url.includes('api.openweathermap.org')) {
//     // response to API requests, Cache Update Refresh strategy
//     event.respondWith(caches.match(event.request));
//     event.waitUntil(update(event.request).then(refresh));
//   } else {
//     // response to static files requests, Cache-First strategy
//   }
// });
function update(request) {
  return fetch(request.url).then(
    (response) =>
      cache(request, response) // we can put response in cache
        .then(() => response) // resolve promise with the Response object
  );
}
function refresh(response) {
  return response
    .json() // read and parse JSON response
    .then((jsonResponse) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          // report and send new data to client
          client.postMessage(
            JSON.stringify({
              type: response.url,
              data: jsonResponse.data,
            })
          );
        });
      });
      return jsonResponse.data; // resolve promise with new data
    });
}
