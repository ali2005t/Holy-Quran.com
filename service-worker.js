const CACHE_NAME = 'quran-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/reciters.html',
    '/tasbih.html',
    '/prayer-times.html',
    '/settings.html',
    '/style.css',
    '/darkMode.js',
    '/translations.js',
    '/tasbih.js',
    '/prayer-times.js',
    '/settings.js',
    '/images/app-icon.png',
    '/images/micrfone.png',
    '/images/مواقيت الصلاة.png',
    '/images/abdulbasit.png',
    '/images/khaled.png',
    '/images/maher.png',
    '/images/mishari.png',
    '/images/nasser.png',
    '/images/yasser.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// استراتيجية Cache First ثم Network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

// تحديث Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});