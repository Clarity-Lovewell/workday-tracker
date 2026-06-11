const CACHE_NAME="workday-cache-v1";

const FILES=[
"./",
"./index.html",
"./styles.css",
"./app.js",
"./manifest.json"
];

self.addEventListener("install",e=>{
e.waitUntil(
caches.open(CACHE_NAME)
.then(cache=>cache.addAll(FILES))
);
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request)
.then(response=>{
return response || fetch(e.request);
})
);
});