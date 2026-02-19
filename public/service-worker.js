self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || 'Waktu Sholat', {
    body: data.body || 'Sudah masuk waktu sholat',
    icon: '/logo192.png',
    badge: '/logo192.png'
  });
});
