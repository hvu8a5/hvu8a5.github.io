---
layout: null
---
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;

workbox.core.setCacheNameDetails({
  prefix: "{{ site.title }}",
  suffix: '{{ site.time | date: "%Y-%m-%d" }}'
});

registerRoute(
  '/',
  new NetworkFirst()
);

workbox.precaching.precacheAndRoute([
  {% for file in site.static_files %}
  { url: '{{ file.path }}', revision: '{{ site.time | date: "%Y-%m-%d" }}' },
  {% endfor %}
  {% for page in site.html_pages %}
  { url: '{{ page.url }}', revision: '{{ site.time | date: "%Y-%m-%d" }}' },
  {% endfor %}
  {% for post in site.posts %}
  { url: '{{ post.url }}', revision: '{{ post.date | date: "%Y-%m-%d" }}' },
  {% endfor -%}
])

registerRoute(
  ({request}) => request.destination === 'image' ,
  new CacheFirst({
    plugins: [
      new CacheableResponse({statuses: [0, 200]})
    ],
  })
);
