// AGGRESSIVE SERVICE WORKER FOR INSTANT PHOTO CACHING
const CACHE_NAME = 'code-veda-turbo-cache-v3';
const STATIC_CACHE = 'static-cache-v3';
const IMAGE_CACHE = 'image-cache-v3';

const urlsToCache = [
    '/code-veda.html',
    '/css/styles.css',
    '/css/universal-smooth-scroll.css', 
    '/js/main.js',
    '/js/universal-smooth-scroll.js'
];

const imagesToCache = [
    '/photos/cv.jpeg',
    '/photos/1.jpg',
    '/photos/2.jpg', 
    '/photos/3.jpg',
    '/photos/4.jpg',
    '/photos/5.jpg',
    '/photos/6.jpg',
    '/photos/7.jpg',
    '/photos/8.jpg',
    '/photos/9.jpg',
    '/photos/10.jpg',
    '/photos/11.jpg',
    '/photos/12.jpg'
];

// Install event - AGGRESSIVE CACHING
self.addEventListener('install', function(event) {
    event.waitUntil(
        Promise.all([
            // Cache static resources
            caches.open(STATIC_CACHE).then(function(cache) {
                return cache.addAll(urlsToCache);
            }),
            // Cache images separately with high compression
            caches.open(IMAGE_CACHE).then(function(cache) {
                return Promise.all(
                    imagesToCache.map(url => {
                        return fetch(url, {
                            mode: 'cors',
                            cache: 'force-cache'
                        }).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(err => {
                            // Silently handle cache errors
                        });
                    })
                );
            })
        ]).then(function() {
            self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== STATIC_CACHE && cacheName !== IMAGE_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            self.clients.claim();
        })
    );
});

// TURBO FETCH - Cache-first for instant loading
self.addEventListener('fetch', function(event) {
    const url = event.request.url;
    
    // Handle images with aggressive caching
    if (url.includes('/photos/') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    if (response) {
                        return response;
                    }
                    
                    // Fetch and cache with maximum performance
                    return fetch(event.request, {
                        mode: 'cors',
                        cache: 'force-cache'
                    }).then(function(networkResponse) {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }
    
    // Handle static resources
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            
            return fetch(event.request).then(function(response) {
                if (!response || response.status !== 200) {
                    return response;
                }
                
                const responseToCache = response.clone();
                caches.open(STATIC_CACHE).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });
                
                return response;
            });
        })
    );
});